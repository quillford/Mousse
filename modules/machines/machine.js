var Machine = Class({

    initialize: function(){
        // Create the interface with the machine
        this.interface = new Machineinterface( this );

        // Create the new configuration interface
        this.configuration = new Machineconfiguration( this );

        // Get configuration from the machine 
        this.configuration.get_configuration();

        // Create a new filesystem for this machine
        this.filesystem = new Machinefilesystem( this );

        // Get the filesystem from the machine
        this.filesystem.get_filesystem();

    },






});
