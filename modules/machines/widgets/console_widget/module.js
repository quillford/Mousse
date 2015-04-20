// Creates new consolecontrol objects and attaches them to the machine
var Console_widget = Module.extend({

    // The configuration was read from the machine
    on_config_parsed: function( machine ){
        // We do not do anything before the configuration is parsed
        this.parent_machine = machine;
    },

    on_send_command: function( command ){
        console.log("sending: " + command);
        
        this.parent_machine.interface.send_command({
            command: command + "\n",
            caller: this,
            done: this.on_received_response,
        });
    },
    
    on_received_response: function( request, answer ){
        $("#command_response").text(answer);
    }
    
});



