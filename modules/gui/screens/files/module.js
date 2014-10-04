var Files = Module.extend({

    // The "Files" button was clicked in the navigation bar
    on_main_menu_open_files: function(){
        this.asset("files").appendTo("#main");

        // Setup the new tree
        $('#file_tree').jstree({
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                'data': kernel.machines[0].filesystem.root,
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


    },




    // We were asked to exit this screen
    on_main_menu_close_files: function(){
        $("#main").empty();
    }

});



