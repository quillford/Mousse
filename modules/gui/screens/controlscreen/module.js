var Controlscreen = Module.extend({

    // Some defaults we need
    create: function(){
        this.selected_machine = false;
    },

    // The "Explore" button was clicked in the navigation bar
    on_main_menu_open_control: function(){
        // Append the asset to the main frame
        this.asset("control").appendTo("#main");

        // Configure machine tabs
        this.add_machine_tabs();
    },

    // We were asked to exit this screen
    on_main_menu_close_control: function(){
        $("#main").empty();
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

            // Show the control interface
            $("#control_interface").show();
        }else{
            // TODO : display a nice message explaining there is no machine available
            $("#control_interface").hide();

            // Show the no machines message
            $("#no_machines").show();

            // Set up the scan network button
            $("#control_start_network_scan").click(function(){
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
        $("#control_machine_list").empty();

        // For each machine
        for( var index in kernel.machines ){
            var current = kernel.machines[index]; 

            // Create a new tab
            var tab = $("<li><a href='#'>" + current.ip + "</a></li>");

            // Display selected and unselected differently
            if( current === this.selected_machine ){ tab.addClass('active'); }
      
            // We open the folder if the link is clicked 
            tab.click(function(machine, screen){
                return function(){
                    screen.select_new_machine_tab( machine ); 
                }; 
            }(machine, this));
            
            // Append to the list 
            tab.appendTo("#control_machine_list");

        } 

        // Display this machine's interface
        this.display_control_interface( machine );
        this.update_temperature();
    
        $("#update_temperature").click(function(){
           kernel.call_event("update_temperature");
        });
        
        $("#home_all").click(function(){
           kernel.call_event("send_gcode", "G28");
        });
        
        $("#home_x").click(function(){
           kernel.call_event("send_gcode", "G28 X0");
        });
        
        $("#home_y").click(function(){
           kernel.call_event("send_gcode", "G28 Y0");
        });
        
        $("#home_z").click(function(){
           kernel.call_event("send_gcode", "G28 Z0");
        });
    },

    // Display the full machine interface
    display_control_interface: function( machine ){
        console.log("test");
        $(".gridster").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140],
            widget_selector: "div",
            draggable: {
                handle: "div .panel-heading",
            },
            resize: {
                enabled: true,
            }
        });
    },
    
    // update the extruder and bed temperature
    update_temperature: function(){
      console.log("update temp");
      // get machine ip address
      this.ip = this.selected_machine.ip;
      // send M105
      $.ajax({ 
          url: "http://" + this.ip + '/command',
          caller: this,
          type: "POST",
          data: "M105\n",
          async: true,
      }).done(function(result){console.log("success! : "+result);$("p#tempReport").text(result);}).fail( console.log("Failed to get temperature.") );
    },
    
    // send gcode to the machine
    send_gcode: function( command ){
      // get machine ip address
      this.ip = this.selected_machine.ip;
      
      this.command = command + "\n";
      // send the command
      $.ajax({ 
          url: "http://" + this.ip + '/command',
          caller: this,
          type: "POST",
          data: this.command,
          async: true,
      }).done(function(result){console.log("gcode successfully sent");}).fail( console.log("Failed to send gcode.") );
    }

});



