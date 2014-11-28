var Machineconfigurationscreen = Module.extend({
   
    create: function(){
        this.selected_machine = false;
        this.panels = {};
    },

    on_module_loaded: function(){
    },
 
    // The GUI basics were loaded
    on_gui_container_loaded: function(){
        // Set up the button so this screen can be accessed
        $("#open_machine_configuration").click(function(){
            kernel.call_event("on_open_machine_configuration");
        });
    },  

    // Open the machine configuration screen
    on_open_machine_configuration: function(){
        // Close the currently opened main menu screen
        kernel.call_event("on_main_menu_close_all");

        // Append the asset to the main frame
        this.asset("main").appendTo("#main");

        // Set up the configuration panels
        this.setup_configuration_panels();
 
        // Add the currently available machines
        this.add_machine_tabs();
   },

    // Add the machine tabs
    add_machine_tabs: function(){
        // If a machine is selected, display with that machine selected
        if( this.selected_machine ){
            this.select_new_machine_tab( this.selected_machine );
        }

        // Add the tabs only if a machine is available
        if( kernel.machines.length > 0 ){
            // Select the first machine by default
            this.select_new_machine_tab( kernel.machines[0] );
            
            // Hide the no machines message
            $("#no_machines").hide();

            // Show the configuration interface
            $("#configuration_interface").show();
        
            // Don't show a machine list if only one machine is available
            if( kernel.machines.length == 1 ){
                $("#machine_list").hide();
            } 
        
        }else{
            // Hide the configuration interface 
            $("#configuration_interface").hide();

            // Show the no machines message
            $("#no_machines").show();

            // Set up the scan network button
            $("#configuration_start_network_scan").click(function(){
               networkdetectmodal.display_modal(true); 
            });
        }
    },

    // The user selected a tab ( or we selected the first one automatically )
    select_new_machine_tab: function( machine ){
        // TODO : Hide the tab bar if there is only one machine
        // Generate a new tab bar, with the passed machine selected
        this.selected_machine = machine;

        console.log(machine);

        // Clear the tab bar
        $("#configuration_machine_list").empty();

        // For each machine
        for( var index in kernel.machines ){
            var current = kernel.machines[index]; 

            // Create a new tab
            var tab = $("<li class='list-group-item'><a href='#'>" + current.ip + "</a></li>");

            // Display selected and unselected differently
            if( current === this.selected_machine ){ tab.addClass('list-group-item-success'); }
      
            // We open the folder if the link is clicked 
            tab.click(function(machine, screen){
                return function(){
                    screen.select_new_machine_tab( machine ); 
                }; 
            }(machine, this));
            
            // Append to the list 
            tab.appendTo("#configuration_machine_list");

        } 

        // Display this machine's interface
        this.display_configuration_interface( machine );
    
    },

    // A machine was selected, display the interface for it
    display_configuration_interface: function( machine ){
        // Open the basic panel 
        this.panels.basic.open();
    },

    // Setup the configuration panels
    setup_configuration_panels: function(){

        // Create the basic panel
        this.panels.basic = new Basicconfigurationpanel( this );
        $("#basic_panel").click(function(panel){ return function(){ panel.open(); }; }(this.panels.basic));

        // Create the basic panel
        this.panels.motion = new Motionconfigurationpanel( this );
        $("#motion_panel").click(function(panel){ return function(){ panel.open(); }; }(this.panels.motion));



    },


});



