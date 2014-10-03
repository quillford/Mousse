var Explore = Module.extend({

    // The "Explore" button was clicked in the navigation bar
    on_main_menu_open_explore: function(){
        this.asset("explore").appendTo("#main");
    },

    // We were asked to exit this screen
    on_main_menu_close_explore: function(){
        $("#main").empty();
    }

});



