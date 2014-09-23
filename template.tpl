<!DOCTYPE html>
<html>
   
    [% IF file.type == 'dev' %]
        <!-- This file is for development purposes, it is not self-contained and will fetch all javascript files and included assets when loaded --> 
    [% ELSE %]
        <!-- This file is for deployement purposes, it is a self-contained and compiled version of the interface -->
    [% END %] 

    <head>
        <meta charset="UTF-8">
        <title>MOUSSE</title>
        [% IF file.type == 'dev' %]
            [% FOREACH module = modules %]
                [% FOREACH to_include = module.json_data.Include %]
                   <script src="[% module.folder %]/[% to_include %]"></script> 
                [% END %].
                   <script src="[% module.javascript_file %]"></script> 
            [% END %] 
        [% ELSE %]

            [% FOREACH module = modules %]
                [% FOREACH to_include = module.json_data.Include %]
                   <script type="text/javascript"> [% INSERT "$module.folder/$to_include"  %]</script> 
                [% END %].
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


            kernel.signal_modules_loaded();


        </script>
    </head>
     <body>
    </body>

</html> 

