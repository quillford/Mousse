#!/bin/perl
use strict;
# This script finds all modules and from that list, generates two HTML files : 
# One that contains in itself all of the files the modules need to run ( for deployement, self-contained )
# And one that fetches those files when loaded ( for development )

# If upon running this script you get a missing module error, please locate the module's name then do : 
# sudo cpan Missing::Module::Name 
use JSON::DWIW;
use File::Basename;
use Data::Dumper;
use Template;
use Algorithm::Dependency;
use Algorithm::Dependency::Ordered;
use Algorithm::Dependency::Source::HoA;

# List of modules, including module data
my $modules = [];

# Get all of the modules in the modules/ folder ( recursively ) and store data relevant to later generate the HTML files
for my $module_file ( split("\n", `find ./modules/ -name 'module.json'`) ){

    # Modules are found by the fact their folder contains a "module.json" file
    print "+ $module_file\n";

    # Get the JSON data in the module.json file
    my $file_content = `cat $module_file`;

    # De-serialize JSON data
    my $json_data = JSON::DWIW->from_json($file_content);

    # Get the path to the module file
    my $javascript_file = dirname($module_file) . "/module.js"; 

    # Get the content of the javascript file
    my $javascript_file_content = `cat $javascript_file`;

    # Get module name
    my $module_name = pop( [split('/', dirname($module_file) )] );

    # Get folder
    my $folder = dirname($module_file);

    # Find the list of assets
    my $asset_files = [];
    for my $file ( split("\n", `find $folder -name '*.html'`) ){
        my $asset = {};
        $asset->{file} = $file;
        my ($path) = ( $file =~ /assets\/(.*)\.html$/ );
        $path =~ s/\//-/g;
        $path = lc($module_name) . "-" . $path;
        $asset->{path} = $path;
        push @$asset_files, $asset;
    }

    print "> $module_name\n";

    # Data for passing to template
    my $data = {
        module_name             => $module_name,
        json_filename           => $module_file,
        json_file_content       => $file_content,
        json_data               => $json_data,
        folder                  => $folder,
        javascript_file         => $javascript_file,
        javascript_file_content => $javascript_file_content,
        class_name              => ucfirst $module_name,
        asset_files             => $asset_files,
    }; 

    # Add data to list of modules
    push @{$modules}, $data;

}

# Sort modules respecting dependencies
$modules = [sort_dependencies($modules)];

# Generate the HTML files from the template file
my $engine = Template->new({RELATIVE => 1});

# The two files to generate 
my $files = [
    { type => 'dev' , filename => 'dev.html' },
    { type => 'prod', filename => 'index.html' }
];

# Generate each of the two files
for my $file ( @{$files} ){
    
    # Make the data to pass to the template
    my $data = {
        file => $file,
        modules => [ @$modules ]
    };

    # Process the template
    $engine->process( 'template.tpl', $data, $file->{filename} ) || die $engine->error(), "\n";
}



# Sort all modules taking dependencies into consideration
sub sort_dependencies{
    my $passed_modules = shift;

    # Make unsorted list for passing to dependency resolver
    my $unsorted_modules = {};
    for my $module ( @{$passed_modules} ){
        $unsorted_modules->{$module->{'module_name'}} = [];
        next unless exists $module->{'json_data'}->{'Requires'};
        $unsorted_modules->{$module->{'module_name'}} = $module->{'json_data'}->{'Requires'};
    }

    print Dumper $unsorted_modules;

    # Create the source from it
    my $source = Algorithm::Dependency::Source::HoA->new( $unsorted_modules );

    # Sort everything
    my $dep = Algorithm::Dependency::Ordered->new( source => $source );
    my $schedule = $dep->schedule_all;

    # Create new list based on the new order
    my $ordered_modules = [];
    for my $ordered_module ( @{$schedule} ){
        #Find the module in the original list
        my $module = {};
        for my $candidate ( @{$passed_modules} ){
            if( $candidate->{module_name} eq $ordered_module ){ 
                $module = $candidate;
                last;
            }
        }
        push @{$ordered_modules}, $module;
    }

    print Dumper $schedule;

    # Replace the undordered list by the one ordered by dependencies
    return @{$ordered_modules};
}
