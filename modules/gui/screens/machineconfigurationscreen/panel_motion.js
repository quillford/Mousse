var Motionconfigurationpanel = Class({

    create: function( parent ){
        this.parent = parent;
    },

    open: function(){
        // Append the asset to the configuration panel
        $("#configuration_panel").empty();
        this.parent.asset("motion_panel").appendTo("#configuration_panel");

        // Remember the machine
        this.machine = this.parent.selected_machine;
   
        // Setup the panel
        this.setup(); 
    },

    setup: function(){
        // For each axis, set up the value modification 
        var axes = ['alpha', 'beta', 'gamma'];
        for( var index in axes ){
            var axis = axes[index]; 
            
            // Display values for steps_per_mm
            if( typeof this.machine.configuration[ axis + '_steps_per_mm' ] !== "undefined" ){
                $("#" + axis + "_steps_per_mm").val( this.machine.configuration[ axis + "_steps_per_mm" ] );
            }
       
            // Save the steps_per_mm value if changed 
            $("#save_" + axis + "_steps_per_mm").click(function(machine, axis){
                return function(){
                    machine.configuration.set_value( axis + "_steps_per_mm", $("#" + axis + "_steps_per_mm").val(), function( result ){
                        $("#" + axis + "_steps_per_mm_placard").tooltip({
                            delay: {hide: 5000}, 
                            placement: 'right',
                        });
                        $("#" + axis + "_steps_per_mm_placard").tooltip('show');
                    });
                }
            }(this.machine, axis));
        }
        $('form').validator();

        // Modify display according to the current arm solution
        if( this.machine.configuration.arm_solution == 'linear_delta' ){
            $('.cartesian_display').hide();
            $('.linear_delta_display').show();
        }else{
            $('.cartesian_display').show();
            $('.linear_delta_display').hide();
        }

        // Setup the calculator wizard
        $("#start_calculator_wizard").click(function(panel){
            return function(){ panel.open_calculator_wizard(); }
        }(this));

        // Create the wizard 
        this.calculator_wizard = new Wizardstepscalculator(this);
    },

    // Open the calculator wizard
    open_calculator_wizard: function(){

        // Open the wizard 
        this.calculator_wizard.open( function(panel){
            return function(){
                $("#" + panel.calculator_wizard.selected_actuator + "_steps_per_mm").val( panel.calculator_wizard.result );
                $("#save_" + panel.calculator_wizard.selected_actuator + "_steps_per_mm").click(); 
                console.log("callback");
            };
        }(this));
    }


}); 
