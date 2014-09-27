var Configuration = new Class({

    create: function( machine ){
        // This object retrieves, stores and allows access to configuration for a specific machine
        this.parent_machine = machine;
    },

    get_configuration: function(){
        // Retrieve the configuration from the machine, parse it and store it
        this.parent_machine.interface.get_file({
            file: "/sd/config", 
            done: this.parse_config_file,
            caller: this    
        });
    },

    parse_config_file: function( config_file ){
        // Parse the config file and store the values in myself 
        config_file = config_file.split("\n");
    
        // For each line in the config file
        for(var index in config_file){
            var line = config_file[index];
    
            // Skip obviously un-interresting lines
            if( line.substr(0,1) == '#' || line.substr(0,1) == ' ' || !line ){ continue; }

            // Remove comments at the end of lines
            line = line.split('#')[0];

            // Extract key and value
            var matches = line.match(/^\s*([^\s]+)\s*([^\s]+)\s*$/);

            // If no matches
            if( !matches ){ continue; }

            // We have a match
            var key = matches[1];
            var value = matches[2];

            // Extract key path
            var key_path = key.split('.');

            // Assign values to ourselves depending on length of they path
            if( key_path.length == 1 ){
                this[key] = value;
            }else if(key_path.length == 2 ){
                if( this[key_path[0]] == undefined ){ this[key_path[0]] = {}; } 
                this[key_path[0]][key_path[1]] = value;
            }else if(key_path.length == 3 ){
                if( this[key_path[0]] == undefined ){ this[key_path[0]] = {}; } 
                if( this[key_path[0]][key_path[1]] == undefined ){ this[key_path[0]][key_path[1]] = {}; }
                this[key_path[0]][key_path[1]][key_path[2]] = value;
            } 
        } 

        // The configuration is ready, call the on_config_parsed event
        kernel.call_event("on_config_parsed", this.parent_machine);

    }



}); 
