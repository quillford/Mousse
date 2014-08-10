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

# List of modules, including module data
my $modules = [];

# Get all of the modules in the modules/ folder ( recursively ) and store data relevant to later generate the HTML files
for my $module_file ( split("\n", `find ./modules/ -name 'module.json'`) ){

    # Modules are found by the fact their folder contains a "module.json" file
    print "> $module_file\n";

    # Get the JSON data in the module.json file
    my $file_content = `cat $module_file`;

    # De-serialize JSON data
    my $json_data = JSON::DWIW->from_json($file_content);

    # Get the path to the module file
    my $javascript_file = dirname($module_file) . "/module.js"; 

    # Data for passing to template
    my $data = {
        json_file         => $json_data,
        json_filename     => $module_file,
        json_file_content => $file_content,
        folder            => dirname $module_file,
        module_base_code  => `cat $module_file`
    }; 

    # Add data to list of modules
    push @{$modules}, $data;

}

# print Dumper $modules;

# Generate the HTML files from the template file
my $engine = Template->new({});

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
        modules => $modules
    };

    # Process the template
    $engine->process( 'template.tpl', $data, $file->{filename} );

}

