#!/bin/perl
use strict;

# If upon running this script you get a missing module error, please locate the module's name then do : 
# sudo cpan Missing::Module::Name 
use JSON::DWIW;
use File::Basename;
use Data::Dumper;
use Template::Toolkit;

# List of modules, including module data
my $modules = [];

# Get all of the modules in the modules/ folder ( recursively )
for my $module_file ( split("\n", `find ./modules/ -name 'module.json'`) ){

    # Modules are found by the fact their folder contains a "module.json" file
    print "> $module_file\n";

    # Get the JSON data in the module.json file
    my $file_content = `cat $module_file`;

    # De-serialize JSON data
    my $json_data = JSON::DWIW->from_json($file_content);

    # Data for passing to template
    my $data = {
        json_file => $json_data,
        json_filename => $module_file,
        json_file_content => $file_content,
        folder => dirname $module_file
    }; 

    # Add data to list of modules
    push @{$modules}, $data;

}


print Dumper $modules;


