// Creates new printstatuswidget objects and attaches them to the controlscreen
var Printstatuswidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("status"), sizex: 2, sizey: 1});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        // Add a listener for the abort print button
        $("#abort_print").click(function(){
            // Ask the user if they really want to cancel the print
            bootbox.dialog("Abort the print?", [{
                "label" : "Abort",
                "class" : "btn-danger",
                "callback": function() {
                    kernel.call_event("on_send_command", "abort");
                }
            },{
                "class" : "btn-default",
                "label" : "Cancel"
            }]);
        });
    },
    
    // Update the print progress when we are told
    on_value_update: function(result){
        // Set print_progress
        if (result.progress.playing){
            $("#print_progress").text(result.progress.string);
        }else {
            $("#print_progress").text("No print in progress");
        }
        
    }
    
});



