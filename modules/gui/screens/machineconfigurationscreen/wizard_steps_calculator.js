var Wizardstepscalculator = Class({

    create: function( parent ){
        this.parent = parent;
    },

    open: function( callback ){
        // Remember the machine we are currently operating on
        this.machine = this.parent.machine;

        // Remember the callback
        this.callback = callback;

        // Setup selected values
        this.selected_actuator = false;
        this.selected_type = false;

        // Setup and open the modal
        this.setup();
    },

    // Setup the wizard
    setup: function(){
        // Display the new modal
        $("#wizardstepscalculatormodal").modal();
 
        // Set the modal in the right order in the page so it is not confused with it's asset 
        $(".modal-scrollable").insertBefore("#assets");

        // Set up the wizard
        $("#wizardstepscalculator").wizard();

        // Set up wizard steps
        var _that = this;
        $('#wizardstepscalculator').on('changed.fu.wizard', function (evt, data) {
            switch( data.step ){
                case 1: _that.goto_axis_selection_step(); break;
                case 2: _that.goto_axis_type_step(); break;
                case 3: _that.goto_configuration_step(); break;
                case 4: _that.goto_mechanical_step(); break;
                case 5: _that.goto_calculation_step(); break;
            } 
        });

        // Go to the first step if we were not already there
        $('#wizardstepscalculator').wizard('selectedItem', { step: 1 });

        // Go to the axis selection step
        //this.goto_axis_selection_step();

    },

    goto_axis_selection_step: function(){
        // Modify display according to the current arm solution
        if( this.machine.configuration.arm_solution == 'linear_delta' ){
            $('.cartesian_display').hide();
            $('.linear_delta_display').show();
        }else{
            $('.cartesian_display').show();
            $('.linear_delta_display').hide();
        }

        // For each axis, display current values and setup buttons
        var axes = ['alpha', 'beta', 'gamma'];
        for( var index in axes ){
            var axis = axes[index]; 
            // Display values for steps_per_mm
            if( typeof this.machine.configuration[ axis + '_steps_per_mm' ] !== "undefined" ){
                $("#wizard_array_" + axis + "_steps_per_mm").html( this.machine.configuration[ axis + "_steps_per_mm" ] );
            }

            // Make selection buttons clickable
            $("#wizard_array_select_" + axis).off().click(function(axis, wizard){
                return function(){
                    wizard.selected_actuator = axis; 
                    $('#wizardstepscalculator').wizard('selectedItem', { step: 2 });
                };
            }(axis, this));
        }
        
        // Set up buttons
        $("#wizardstepscalculator .btn-next").prop('disabled', 'true');

    },

    goto_axis_type_step: function(){
        // Set up the buttons
        var types = ['belt', 'screw'];
        for( var index in types ){
            var type = types[index];

            // Make selection buttons clickable
            $("#wizard_actuator_type_" + type).off().click(function(type, wizard){
                return function(){ 
                    wizard.selected_type = type;
                    $('#wizardstepscalculator').wizard('selectedItem', { step: 3 });
                };
            }(type, this));
        }   
     
        // Set up buttons
        $("#wizardstepscalculator .btn-next").prop('disabled', 'true');
    },

    goto_configuration_step: function(){
        // Set up the form
        $("#wizard_motor_steps_per_turn_select").change(function(){
            $("#wizard_motor_steps_per_turn").val($(this).val());
        });
        $("#wizard_motor_microstepping_select").change(function(){
            $("#wizard_motor_microstepping").val($(this).val());
        });

        // Next button
        $("#wizard_motor_configuration_next").off().click(function(wizard){
            return function(){ 
                $('#wizardstepscalculator').wizard('selectedItem', { step: 4 });
            };
        }(this));
 
        // Set up buttons
        $("#wizardstepscalculator .btn-next").prop('disabled', 'false');


    },

    goto_mechanical_step: function(){
        // Hide the panel we are not using
        if( this.selected_type == 'belt' ){
            $("#wizard_mechanical_leadscrew_config").hide();
            $("#wizard_mechanical_belt_config").show();
        }else{
            $("#wizard_mechanical_leadscrew_config").show();
            $("#wizard_mechanical_belt_config").hide();
        }

        // Set up the form
        $("#wizard_mechanical_belt_pitch_select").change(function(){
            $("#wizard_mechanical_belt_pitch").val($(this).val());
        });
        $("#wizard_mechanical_leadscrew_pitch_select").change(function(){
            $("#wizard_mechanical_leadscrew_pitch").val($(this).val());
        });

        // Ratio display
        var ratio_changed = function(wizard){
            return function(){
                var ratio_in  = $("#wizard_mechanical_ratio_in" ).val();
                var ratio_out = $("#wizard_mechanical_ratio_out").val();
                if( ratio_in == ratio_out ){
                    $("#wizard_mechanical_ratio_display").html(
                        "This ratio of <kbd>" + ratio_in + ":" + ratio_out + "</kbd> results in no reduction"    
                    ); 
                }
                if( ratio_out > ratio_in ){
                    $("#wizard_mechanical_ratio_display").html(
                        "This ratio of <kbd>" + ratio_in + ":" + ratio_out + "</kbd> results in an increase of " + Math.abs(Math.round( ( ( ratio_out / ratio_in )) * 100 )) + "%"   
                    ); 
                }
                if( ratio_in > ratio_out ){
                    $("#wizard_mechanical_ratio_display").html(
                        "This ratio of <kbd>" + ratio_in + ":" + ratio_out + "</kbd> results in a reduction of " + Math.abs(Math.round( ( ( ratio_in / ratio_out )) * 100 )) + "%"   
                    ); 
                }
            } 
        }(this); 
        $("#wizard_mechanical_ratio_in").change( ratio_changed );
        $("#wizard_mechanical_ratio_out").change( ratio_changed );
        $('#wizard_mechanical_ratio_in_spinbox').on('changed.fu.spinbox', ratio_changed );
        $('#wizard_mechanical_ratio_out_spinbox').on('changed.fu.spinbox', ratio_changed );
        ratio_changed.call();       

        // Next button
        $("#wizard_mechanical_configuration_next").off().click(function(wizard){
            return function(){ 
                $('#wizardstepscalculator').wizard('selectedItem', { step: 5 });
            };
        }(this));

        // Set up buttons
        $("#wizardstepscalculator .btn-next").prop('disabled', 'false');
    },

    goto_calculation_step: function(){
        // Set up buttons
        $("#wizardstepscalculator .btn-next").prop('disabled', 'false');

        // Get the values
        var steps_per_turn = $("#wizard_motor_steps_per_turn").val();
        var microstepping = $("#wizard_motor_microstepping").val(); 
        var belt_pitch = $("#wizard_mechanical_belt_pitch").val();
        var pulley_teeth = $("#wizard_mechanical_pulley_teeth").val();

        // Compute and display microstepssteps per turn
        var microsteps_per_turn = steps_per_turn * microstepping; 
        $("#wizard_calculation_microsteps_per_turn").html( 
            "steps per turn <kbd>" + steps_per_turn + "</kbd> x microstepping <kbd>" + microstepping + "</kbd> = microsteps per rotation <kbd>" + microsteps_per_turn + "</kbd>"
        );

        // Compute and display rotations per millimeter
        var millimeters_per_rotation = belt_pitch * pulley_teeth;
        $("#wizard_calculation_millimeters_per_rotation").html(
            "belt pitch <kbd>" + belt_pitch + "</kbd> x pulley teeth <kbd>" + pulley_teeth + "</kbd> = millimeters per rotation <kbd>" + millimeters_per_rotation + "</kbd>"
        );

        // Compute and display microsteps per millimeter
        var microsteps_per_millimeter = microsteps_per_turn / millimeters_per_rotation;
        $("#wizard_calculation_microsteps_per_millimeter").html(
            "microsteps per rotation <kbd>" + microsteps_per_turn + "</kbd> &divide; millimeters per rotation <kbd>" + millimeters_per_rotation + "</kbd> = microsteps per millimeter <kbd>" + microsteps_per_millimeter + "</kbd>" 
        );

        // Display the result
        $("#wizard_calculation_result_actuator").html( this.selected_actuator );
        $("#wizard_calculation_result_value").html(microsteps_per_millimeter);

        // Remember the result
        this.result = microsteps_per_millimeter;

        // Setup the save button
        $("#wizard_calculation_save").off().click(function(wizard){
            return function(){
                // Call the callback
                wizard.callback.call();

                // Close the modal
                $("#wizardstepscalculatormodalclose").click(); 
            };
        }(this));

    },

}); 
