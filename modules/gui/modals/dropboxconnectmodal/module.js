var Dropboxconnectmodal = Module.extend({
   
    on_module_loaded: function(){
 
 
    },

    // The user requested to connect to dropbox
    on_dropbox_connection_request: function(){
        // Request authorisation to display a new modal
        gui.modal.add_demand(this, this.display_modal);
    },

    // We were allowed by the modal queue to display the modal
    display_modal: function(){
        // Display the new modal
        $(this.asset('modal')).appendTo("#current_modal");
        $("#dropboxconnectmodal").modal();

        // Set up the "go to dropbox for auth" button
        var _this = this; 
        $("#go_to_dropbox_for_auth").click(function(){
            kernel.call_event("on_go_to_dropbox_for_auth"); 
        });

    },



});



