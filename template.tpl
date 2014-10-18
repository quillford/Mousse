<!DOCTYPE html>
<html>
   
    [% IF file.type == 'dev' %]
        <!-- This file is for development purposes, it is not self-contained and will fetch all javascript files and included assets when loaded --> 
    [% ELSE %]
        <!-- This file is for deployement purposes, it is a self-contained and compiled version of the interface -->
    [% END %] 

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>MOUSSE</title>

        <!-- Dropbox is retreived online as it is useless if we don't have an internet connection, and that's what they recommend --> 
        <script src="http://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js"></script>

        [% IF file.type == 'dev' %]
            [% FOREACH module = modules %]
                [% FOREACH to_include = module.json_data.IncludeCSS %]
                   <link rel="stylesheet" href="[% module.folder %]/[% to_include %]">
                [% END %]
                [% FOREACH to_include = module.json_data.Include %]
                   <script src="[% module.folder %]/[% to_include %]"></script> 
                [% END %]
                   <script src="[% module.javascript_file %]"></script> 
            [% END %] 
        [% ELSE %]

            [% FOREACH module = modules %]
                [% FOREACH to_include = module.json_data.IncludeCSS %]
                   <style> [% INSERT "$module.folder/$to_include"  %]</style> 
                [% END %]
                [% FOREACH to_include = module.json_data.Include %]
                   <script type="text/javascript"> [% INSERT "$module.folder/$to_include"  %]</script> 
                [% END %]
                   <script type="text/javascript"> [% INSERT "$module.javascript_file" %] </script> 
            [% END %] 
        [% END %] 

        <script type="text/javascript">

            // Instantiate kernel
            var kernel = new Kernel();
           
            // Instantiate all of the modules 
            [% FOREACH module = modules %]
                [% NEXT IF module.module_name == 'kernel' %]
                [% NEXT IF module.module_name == 'module' %]
                var [% module.module_name %] = new [% module.class_name %]();
                kernel.add_module( "[% module.module_name %]", [% module.module_name %] );
            [% END %] 

            // When the document is loaded, have kernel tell all the modules
            $().ready( function(){ kernel.signal_modules_loaded(); } );


        </script>

        <style>
            .wholescreen{
                width:100%;
                height:100%;
            }

            .bs-callout {
                padding: 20px;
                margin: 20px 0;
                border: 1px solid #eee;
                border-left-width: 5px;
                border-radius: 3px;
            }
            .bs-callout h4 {
                margin-top: 0;
                margin-bottom: 5px;
            }
            .bs-callout p:last-child {
                margin-bottom: 0;
            }
            .bs-callout code {
                border-radius: 3px;
            }
            .bs-callout+.bs-callout {
                margin-top: -5px;
            }
            .bs-callout-default {
                border-left-color: #777;
            }
            .bs-callout-default h4 {
                color: #777;
            }
            .bs-callout-primary {
                border-left-color: #428bca;
            }
            .bs-callout-primary h4 {
                color: #428bca;
            }
            .bs-callout-success {
                border-left-color: #5cb85c;
            }
            .bs-callout-success h4 {
                color: #5cb85c;
            }
            .bs-callout-danger {
                border-left-color: #d9534f;
            }
            .bs-callout-danger h4 {
                color: #d9534f;
            }
            .bs-callout-warning {
                border-left-color: #f0ad4e;
            }
            .bs-callout-warning h4 {
                color: #f0ad4e;
            }
            .bs-callout-info {
                border-left-color: #5bc0de;
            }
            .bs-callout-info h4 {
                color: #5bc0de;
            }








        </style>


    </head>
     <body class="fuelux">

        <div id="current_modal">

        </div>
       
        <div id="root" class="wholescreen">

        </div>
 
        <div id="assets" style="display:none">
            [% FOREACH module = modules %]
                [% FOREACH asset = module.asset_files %]
                    <div id="[% asset.path %]" class="wholescreen">
                        [% IF file.type == 'dev' %]
                            <script type="text/javascript">
                                $("#[% asset.path %]").load( "[% asset.file %]" );
                            </script> 
                           [% asset.path %]
                        [% ELSE %]
                            [% INSERT "$asset.file" %]
                        [% END %] 
                    </div>
                [% END %] 
            [% END %] 
        </div>

    </body>
</html> 

