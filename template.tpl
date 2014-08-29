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
                <script src="[% module.javascript_file %]"></script> 
            [% END %] 
        [% ELSE %]
            [% FOREACH module = modules %]
               <script type="text/javascript"> [% module.javascript_file_content %] </script> 
            [% END %] 
        [% END %] 
    </head>
  
     <body>
    </body>

</html> 

