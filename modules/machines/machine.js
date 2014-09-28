var Machine = Class({

    initialize: function(){
        // Create the interface with the machine
        this.interface = new Machineinterface( this );

        // Create the new configuration interface
        this.configuration = new Configuration( this );

        // Get configuration from the machine 
        this.configuration.get_configuration();

    },






});
