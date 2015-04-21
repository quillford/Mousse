// Creates new printstatuswidget objects and attaches them to the controlscreen
var Printstatuswidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("status").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the abort print button
        $("#abort_print").click(function(){
            // Ask the user if they really want to cancel the print
            bootbox.dialog("Abort the print?", [{
                "label" : "Abort",
                "class" : "btn-danger",
                "callback": function() {
                    kernel.call_event("send_gcode_silent", "abort");
                }
            },{
                "class" : "btn-default",
                "label" : "Cancel"
            }]);
        });
    },
    
    // Update values such as temperature and progress
    on_value_update: function(result){
        // Set print_progress
        if (result.progress.playing){
            $("#print_progress").text(result.progress.string);
        }else {
            $("#print_progress").text("No print in progress");
        }
        
    }
    
});



