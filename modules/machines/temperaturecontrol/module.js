// Creates new temperaturecontroller objects and attaches them to the machine
var Temperaturecontrol = Module.extend({

    // The configuration was read from the machine
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
    },

    // The updater requested values from the machine and is now passing them as an event
    on_value_update: function( values ){
        // For each of my controllers
        for( var index in this.controllers ){
            var controller = this.controllers[index];  

            // This is the current reading for this controller
            var reading = values.temperature[controller.configuration.designator];

            // Assign those values to the current controller
            controller.temperature = reading.temperature;
            controller.target = reading.target;
            controller.pwm = reading.pwm;

            // Tell the controller it's value was updated
            controller.values_updated();

        } 


    }
});



