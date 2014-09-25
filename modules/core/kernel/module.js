// Kernel stores a list of modules, and passes events to them when requested to

var Kernel = Class({

    create: function(){
        // Hash of modules for referencing
        this.modules = {};
    
        // Array of modules for dependency-ordered calling
        this.module_list = [];

    },

    add_module: function( name, module ){
        // Add module to the hash of modules
        this.modules[ name ] = module;

        // Add module to the list of modules
        this.module_list.push( module );

        // Attach the module to this kernel
        module.kernel = this;
    },

    signal_modules_loaded: function( ){
        // Signal each module that it is now loaded
        this.call_event('on_module_loaded');
    },

    call_event: function(event_name, parameters){
        // Call this event for each module that has a function for it 
        this.module_list.forEach(function(module, index, array){    
            if( typeof module[event_name] === 'function' ){
                module[event_name].call(module, parameters);
            }
        });
    }





});


