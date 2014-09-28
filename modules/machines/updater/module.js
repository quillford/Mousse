var Updater = Module.extend({

    on_config_parsed: function( machine ){
        // Create an updater and add it to the machine
        new Machineupdater(machine); 
    }

});



