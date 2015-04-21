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
    
    // Update values such as temperature and progress
    on_value_update: function(result){
        // Set the Temperature
        $("#tempReport").text("Extruder: "+result.temperature.T.temperature+"°C");
    }
    
});



