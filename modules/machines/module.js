var Machines = Module.extend({
   
    on_module_loaded: function(){
        // Store a list of discovered machines ( in the kernel for easy access )
        this.kernel.machines = []; 
    },

    on_machine_discovered: function( discovered_machine ){
        // Create a new machine
        var machine = new Machine();
        machine.ip = discovered_machine.ip;
        machine.version = discovered_machine.version;
        machine.kernel = this.kernel;

        // Add the machine to the list
        this.kernel.machines.push( machine );

        // Initialize the machine
        machine.initialize();
    }

});



