var Gui = Module.extend({

    on_module_loaded: function(){
        // Add the basic skeleton for the page
        this.asset("body").appendTo('body'); 

        // Tell other modules this is ready
        kernel.call_event("on_gui_container_loaded");
    }

});



