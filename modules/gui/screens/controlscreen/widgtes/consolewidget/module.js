// Creates new consolecontrol objects and attaches them to the controlscreen
var Consolewidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        this.asset("console").find(".panel").appendTo("#widget_interface");
        
        // Save the machine and its config
        this.parent_machine = machine;
        
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



