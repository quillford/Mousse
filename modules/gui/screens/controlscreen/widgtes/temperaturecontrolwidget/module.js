// Creates new extrusionwidget objects and attaches them to the controlscreen
var Extrusionwidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("control").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the set extruder temperature button
        $("#set_extruder_temperature").click(function(){
            kernel.call_event("send_gcode_silent", "M104 S"+$("#extruder_temperature_input").val());
        });
        
        // Add a listener for the set bed temperature button
        $("#set_bed_temperature").click(function(){
            kernel.call_event("send_gcode_silent", "M140 S"+$("#bed_temperature_input").val());
        });
        
        // Add a listener for the set extruder temperature button
        $("#extruder_heat_off").click(function(){
            kernel.call_event("send_gcode_silent", "M104 S0");
        });
        
        // Add a listener for the set bed temperature button
        $("#bed_heat_off").click(function(){
            kernel.call_event("send_gcode_silent", "M140 S0");
        });
    }
    
});



