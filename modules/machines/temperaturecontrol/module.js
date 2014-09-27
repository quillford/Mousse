// Creates new temperaturecontroller objects and attaches them to the machine
var Temperaturecontrol = Module.extend({

    on_config_parsed: function( machine ){
        // We do not do anything before the configuration is parsed
        this.parent_machine = machine;
        machine.temperaturecontrol = this;
        this.controllers = {};
   
        // Read the configuration and create new controllers as needed
        if( 'temperature_control' in  machine.configuration ){
            
            // For each defined temperature_control
            for( var key in machine.configuration.temperature_control ){
                if( machine.configuration.temperature_control[key].enable == "true" ){
                    // Make a new temperature controller
                    this.controllers[key] = new Temperaturecontroller( this, key, machine.configuration.temperature_control[key] ); 
                }
            }
        }
    }
});



