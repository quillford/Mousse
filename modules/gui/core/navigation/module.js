var Navigation = Module.extend({

    // The main GUI container was loaded
    on_gui_container_loaded: function(){
        // Display the navigation bar
        this.asset("navigation").appendTo("#header");

        // Nothing is selected yet
        this.selected = "none";

        // Setup the main menu buttons
        $("#header button.main-menu").click(function(){ 
            navigation.main_menu_button_clicked(this);
        });

        // By default we display the "explore" screen
        this.main_menu_button_clicked( $("#header button.main-menu:contains('Explore')") ); 
   },

    // A button in the main menu was clicked
    main_menu_button_clicked: function( clicked_element ){
        // Set the new button to active
        $("#header button.main-menu").removeClass("active");
        $(clicked_element).addClass("active"); 
       
        // Find out which button was clicked 
        var screen = $(clicked_element).text().toLowerCase().replace(/[^a-z]/g,'');
       
        // Close the currently open screen
        kernel.call_event("on_main_menu_close_" + this.selected);

        // Mark the new one as selected
        this.selected = screen;

        // Call the correct screen
        kernel.call_event("on_main_menu_open_" + screen);
    }
});



