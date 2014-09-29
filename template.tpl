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
    </head>
     <body>

        <div id="current_modal">

        </div>
       
        <div id="root">

        </div>
 
        <div id="assets" style="display:none">
            [% FOREACH module = modules %]
                [% FOREACH asset = module.asset_files %]
                    <div id="[% asset.path %]">
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

