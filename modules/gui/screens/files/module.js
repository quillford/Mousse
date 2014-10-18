var Files = Module.extend({

    // The "Files" button was clicked in the navigation bar
    on_main_menu_open_files: function(){
        this.asset("files").appendTo("#main");

        // TODO : This is not the right thing to do
        var data;
        if( kernel.machines.length > 0 ){
            data = kernel.machines[0].filesystem.root;
        }

        // Setup the new tree
        $('#file_tree').jstree({
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                'data': data,
            },
            'plugins': ['wholerow'],
        });

        // Hide files because we only want to show folders
        $("#file_tree").bind("loaded.jstree", function(event, data) {
            $('#file_tree').find('.jstree-leaf').hide();
        });
        $("#file_tree").bind("open_node.jstree", function(event, data) {
            $('#file_tree').find('.jstree-leaf').hide();
        });

        // A folder was selected
        $("#file_tree").bind('changed.jstree', function (e, data) {
            if(data && data.selected && data.selected.length) {
                var clicked = data.find( data.node.original.path.replace(/^(\/)/, '').split('/') );
                console.log(clicked);
                $("#file_list").html(clicked.path);
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
    }
});



