// Creates new fancontrolwidget objects and attaches them to the controlscreen
var Fancontrolwidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("control").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the fans on button
        $("#fans_on").click(function(){
            kernel.call_event("send_gcode_silent", "M106");
        });
        
        // Add a listener for the fans off button
        $("#fans_off").click(function(){
            kernel.call_event("send_gcode_silent", "M107");
        });
    }
    
});



