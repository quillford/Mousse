// Creates new temperaturewidget objects and attaches them to the controlscreen
var Temperaturewidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("temperature").find(".panel").appendTo("#widget_interface");
    },
    
    // Update extruder and bed temperature
    on_value_update: function(result){
        // Display the extruder's temperature
        $("#extruder_temp").text("Extruder: "+result.temperature.T.temperature+"°C");
        
        // If the machine has a heated bed, display its temperature
        if(this.parent_machine.configuration.temperature_control.bed.enable == "true"){
            $("#bed_temp").text("Bed: "+result.temperature.B.temperature+"°C");
        }else {
            $("#bed_temp").text("");
        }
    }
    
});



