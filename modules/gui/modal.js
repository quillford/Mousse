// This class is a queue of modals to execute. This is used to make sure not more than one modal is opened at a time. Use it imperatively if using a modal
var Guimodal = new Class({

    create: function(){
        this.queue = [];
    },

    add_demand: function( caller, method, parameters ){
        // Add the demand to the queue 
        this.queue.push({caller: caller, method: method, parameters: parameters});
       
        // Try to execute the next demand
        this.try_to_execute_next_demand(); 
    },

    try_to_execute_next_demand: function(){
        // Don't execute if queue is empty
        if( !this.queue[0] ){ return; }
    
        // Don't execute a demand that is already executing
        if( this.queue[0].executing == true ){ return; }

        // No reason not to execute
        this.queue[0].executing = true;
        this.queue[0].method.call(this.queue[0].caller, this.queue[0].parameters); 
    },

    current_modal_closed:function(){
        // Remove the current demand
        this.queue.shift();

        // Try to execute the next one
        this.try_to_execute_next_demand();
    }



});
