var Machineinterface = Class({
    
    create: function( machine ){
        this.machine = machine;
        this.queue = new Interfacequeue(this);
    },

    // Get a file from a non-ajax call ( simply accessing it's path )
    get_file: function( arguments ){
        // Make a new request
        var new_request = new Interfacerequest( arguments ); 

        // This is a file request
        new_request.type = 'file';

        // Add the request to the queue for execution
        this.queue.append_request( new_request );
    },

    // Send a command to the machine ( ajax-like call )
    send_command: function( arguments ){
        // Make a new request
        var new_request = new Interfacerequest( arguments ); 

        // This is a file request
        new_request.type = 'command';

        // Add the request to the queue for execution
        this.queue.append_request( new_request );

    },

    // Return true if the queue has items in it. used by modules that can try later and do not want to disturb the board
    is_busy: function(){
        if( this.queue.queue.length > 1 ){
            return true;
        }else{
            return false;
        }
    }


});
