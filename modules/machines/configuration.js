var Configuration = new Class({

    create: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.machine = machine;
    },

    get_configuration: function(){
        // Retrieve the configuration from the machine, parse it and store it
        this.machine.interface.get_file({
            file: "/sd/config", 
            done: function( result ){ console.log(result); },
            caller: this    
        });
    }



}); 
