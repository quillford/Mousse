// Creates new extrusionwidget objects and attaches them to the controlscreen
var Extrusionwidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("control").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the extrude button
        $("#extrude").click(function(){
            kernel.call_event("on_send_command", "G91 G0 E"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
        
        // Add a listener for the retract button
        $("#retract").click(function(){
            kernel.call_event("on_send_command", "G91 G0 E-"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
    }
    
});



