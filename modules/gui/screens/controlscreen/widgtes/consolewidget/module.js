// Creates new consolecontrol objects and attaches them to the machine
var Consolewidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        this.asset("console").find(".panel").appendTo("#widget_interface");
        
        // Get the command the user requested we send
        var command_text = $("#command_text").val();
        // Add a listener for the send_command button
        $("#send_command").click(function(command_text){ kernel.call_event("on_send_console_command", $("#command_text").val()); });
    },
    
    on_send_console_command: function( command ){
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



