var Files = Module.extend({

    // The "Files" button was clicked in the navigation bar
    on_main_menu_open_files: function(){
        this.asset("files").appendTo("#main");
    },

    // We were asked to exit this screen
    on_main_menu_close_files: function(){
        $("#main").empty();
    }

});



