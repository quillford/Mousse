// Creates new extrusionwidget objects and attaches them to the controlscreen
var Temperaturecontrolwidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
        
        // Check if the machine has a heated bed
        if(this.parent_machine.configuration.temperature_control.bed.enable == "false"){
            $("#bed_temp_input").hide();
        }
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("control").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the set extruder temperature button
        $("#set_extruder_temperature").click(function(){
            kernel.call_event("on_send_command", "M104 S"+$("#extruder_temperature_input").val());
            $("#extruder_temperature_input").val("");
        });
        
        // Add a listener for the set bed temperature button
        $("#set_bed_temperature").click(function(){
            kernel.call_event("on_send_command", "M140 S"+$("#bed_temperature_input").val());
            $("#bed_temperature_input").val("");
        });
        
        // Add a listener for the set extruder temperature button
        $("#extruder_heat_off").click(function(){
            kernel.call_event("on_send_command", "M104 S0");
            $("#extruder_temperature_input").val("");
        });
        
        // Add a listener for the set bed temperature button
        $("#bed_heat_off").click(function(){
            kernel.call_event("on_send_command", "M140 S0");
            $("#bed_temperature_input").val("");
        });
    },
    
    // Update the display for the extruder and bed temperature target
    on_value_update: function(result){
        // Display the extruder's target temperature
        $("#extruder_temperature_input").attr("placeholder", result.temperature.T.target);
        
        // If the machine has a heated bed, display its temperature target
        if(this.parent_machine.configuration.temperature_control.bed.enable == "true"){
            $("#bed_temperature_input").attr("placeholder", result.temperature.B.target);
        }
    }
    
});



