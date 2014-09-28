var Navigation = Module.extend({

    // The main GUI container was loaded
    on_gui_container_loaded: function(){
        // Display the navigation bar
        this.asset("navigation").appendTo("#header");

        // Setup the main menu buttons
        $("#header button.main-menu").click(function(){ 
            navigation.main_menu_button_clicked(this);    
        });

        // By default we display the "explore" screen
        kernel.call_event("on_main_menu_call_explore");
    },

    // A button in the main menu was clicked
    main_menu_button_clicked: function( clicked_element ){
        // Set the new button to active
        $("#header button.main-menu").removeClass("active");
        $(clicked_element).addClass("active"); 

        // Call the correct screen
        var screen = $(clicked_element).text().toLowerCase().replace(/[^a-z]/g,'');
        console.log("on_main_menu_call_" + screen);
        kernel.call_event("on_main_menu_call_" + screen);
    }
});



