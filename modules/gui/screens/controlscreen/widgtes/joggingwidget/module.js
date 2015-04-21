// Creates new joggingwidget objects and attaches them to the controlscreen
var Joggingwidget = Module.extend({

    on_config_parsed: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    on_populate_control_screen: function(){
        // We were asked to add the widget to the control screen
        this.asset("control").find(".panel").appendTo("#widget_interface");
        
        // Add a listener for the home all axes button
        $("#home_all").click(function(){
            kernel.call_event("on_send_command", "G28");
        });
        
        // Add a listener for the home x button
        $("#home_x").click(function(){
            kernel.call_event("on_send_command", "G28 X0");
        });
        
        // Add a listener for the home y button
        $("#home_y").click(function(){
            kernel.call_event("on_send_command", "G28 Y0");
        });
        
        // Add a listener for the home z button
        $("#home_z").click(function(){
            kernel.call_event("on_send_command", "G28 Z0");
        });
        
        // Add a listener for the jog x buttons
        $("#positive_x").click(function(){
            kernel.call_event("on_send_command", "G91 G0 X"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_x").click(function(){
            kernel.call_event("on_send_command", "G91 G0 X-"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog y buttons
        $("#positive_y").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Y"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        $("#negative_y").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Y-"+$('#jog_increment').val()+" F"+$("#xy_velocity").val()+" G90");
        });
        
        // Add a listener for the jog z buttons
        $("#positive_z").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Z"+$('#jog_increment').val()+" F"+$("#z_velocity").val()+" G90");
        });
        $("#negative_z").click(function(){
            kernel.call_event("on_send_command", "G91 G0 Z-"+$('#jog_increment').val()+" F"+$("#z_velocity").val()+" G90");
        });
        
        // Add a listener for the motors off button
        $("#motors_off").click(function(){
            kernel.call_event("on_send_command", "M18");
        });
    }
    
});



