var Gui = Module.extend({

    create: function(){
        // Create the modal object for things to be able to call several modals without two being on at the same time 
        //this.modal = new Guimodal();
    },

    on_module_loaded: function(){
        // Add the basic skeleton for the page
        this.asset("body").appendTo('#root'); 

        // Tell other modules this is ready
        kernel.call_event("on_gui_container_loaded");
    }

});



