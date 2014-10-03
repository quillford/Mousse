var Interfacequeue = new Class({

    create: function(parent_interface){
        this.queue = [];
        this.parent_interface = parent_interface;
    },

    append_request: function( request ){
        // Tie the request to the queue
        request.parent_queue = this;

        // Append a request to the queue, and if needed, execute it
        this.queue.push( request );

        // Try to execute the next request in the queue
        this.try_to_execute_next_request();
    },

    try_to_execute_next_request: function(){
        // Do nothing if the queue is now empty
        if( !this.queue[0] ){ return; }

        // Do nothing if the first element in the queue is currently being executed
        if( this.queue[0].executing == true ){ return; }

        // We are all clear to execute that request
        this.queue[0].executing = true;
        this.queue[0].execute();

    },

    request_successful: function(result_request, data, xhr, status){
        // The request was succesful, pass it back to whomever requested it, then mark this request as executed, remove it, and remove it from the queue
        // Pass this request back to whomever called
        result_request.success_function.call(result_request.interface_caller, result_request, data, xhr, status);

        // Remove from the queue
        var queue = result_request.interface_request.parent_queue;
        queue.queue.shift();

        // Try to execute the next request
        queue.try_to_execute_next_request();
    },

    request_failed: function(request){
        // This is sad, remove the request from the queue
        this.queue.shift();

        // Try to execute the new request, keep hope
        this.try_to_execute_next_request();

    }

});
