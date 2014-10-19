var Files = Module.extend({

    // The "Files" button was clicked in the navigation bar
    on_main_menu_open_files: function(){
        this.asset("files").appendTo("#main");

        // Get all filesystems for display
        var data = kernel.filesystems;

        // Setup the new tree
        this.tree = $('#file_tree').jstree({
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                'data': data,
                'check_callback': true,
            },
            'plugins': ['wholerow'],
        });

        // Hide files because we only want to show folders
        $("#file_tree").bind("loaded.jstree", function(event, data) {
            //$('#file_tree').find('.jstree-leaf').hide();
        });
        $("#file_tree").bind("open_node.jstree", function(event, data) {
            //$('#file_tree').find('.jstree-leaf').hide();
        });

        // A folder was selected
        $("#file_tree").bind('changed.jstree', function (e, data) {
            if(data && data.selected && data.selected.length) {
                // Find what was clicked 
                var clicked = data.instance.get_node(data.selected[0]); 

                // Get the path
                var path = clicked.original.path.split('/');
                path.shift();

                // Get the actual object not the jstree representation
                var actual = kernel.filesystems[ clicked.original.filesystem_id ].find( path );

                // Call the event
                kernel.call_event("on_file_screen_folder_open", actual);
            }
        });

        // Set up dropbox button
        $("#connect_to_dropbox").click(function(){
            kernel.call_event("on_dropbox_connection_request");
        });

        // Hide it if needed
        if( dropboxclient.connected ){
            $("#connect_to_dropbox").fadeOut();
        }

    },


    // We were asked to exit this screen
    on_main_menu_close_files: function(){
        $("#main").empty();
    },

    // The dropbox client successfully authenticated
    on_dropbox_authenticated: function(){
        // We must hide this button if we connected successfully    
        $("#connect_to_dropbox").fadeOut();
    },

    // Update the tree as new folders are added
    on_filesystem_folder_update: function( folder ){
        if( this['tree'] != undefined ){ 
            $("#file_tree").jstree(true).refresh(folder.parent_id);
        }
    },

    // A folder was clicked in the filetree
    on_file_screen_folder_open: function( folder ){
        // Create the breadcrumb
        this.create_navigation_breadcrumb( folder );

        // Display folder content
        this.display_folder_content( folder );

    },

    // Create the navigation breadcrumb
    create_navigation_breadcrumb: function( folder ){
        // Empty the breadcrumb before displaying 
        $("#file_navigation_breadcrumb").empty();

        // Get path
        var path = folder.path.split('/');

        // Clean up path
        while( path[0] == '' ){ path.shift(); }

        // Get the filesystem
        var filesystem = this.kernel.filesystems[ folder.filesystem_id ];

        // Go down the path
        var current_folder = filesystem;

        // Infinite loop to go down the path
        while(1){
            // Don't go too far
            if( current_folder.children.length == 0 ){ break; }

            // Find all elements in the path
            var current_target = path.shift();

            var found = false;

            // Try to find children
            for( var index in current_folder.children ){
                var candidate = current_folder.children[index];
                if( candidate.text == current_target ){
                    // We found what we were looking for
                    current_folder = candidate;

                    // Display in the breadcrumb
                    var breadcrumb; 
                    if( path.length == 0 ){
                        breadcrumb = $("<li class='active'>" + candidate.text + "</li>");
                    }else{
                        breadcrumb = $("<li><a href='#'>" + candidate.text + "</a></li>");
                    } 
                   
                    // We open the folder if the link is clicked 
                    breadcrumb.click(function(folder){
                       return function(){
                            // Deselect all nodes in the jstree
                            $("#file_tree").jstree(true).deselect_all();
                            
                            // Select the right node in the jstree
                            $("#file_tree").jstree(true).select_node( $("#file_tree").jstree(true).get_node( folder.id ) );

                            // Call the folder open event
                            kernel.call_event("on_file_screen_folder_open", folder);
                        }; 
                    }(candidate));

                    // Add it to the list
                    breadcrumb.appendTo("#file_navigation_breadcrumb");
                    
                    found = true;
                    break;
                }
            }
            // We didn't find any children, this means we are at the end of the path
            if( found == false ){ break; }
        }
    },

    // Display all files in a folder
    display_folder_content: function( folder ){
        // Clear the file list
        $("#file_list").empty();

        // Add to the file list
        $("<tr><th> Name </th><th> Size </th></tr>").appendTo("#file_list");

        // For each element in the list
        for( var index in folder.children ){
            var child = folder.children[index];

            // Skip folders, we want to display only file
            if( child.is_folder() ){ continue; }

            // Create the item 
            var item = $("<tr><td><a href='#'>" + child.text + "</a></td><td><samp>" + child.human_filesize() + "</samp></td></tr>");

            // When a file is clicked
            item.click(function(file){
                return function(){
                    console.log(file);      
                }; 
            }(child));

            // Add to the file list
            item.appendTo("#file_list");

        }
    }

});



