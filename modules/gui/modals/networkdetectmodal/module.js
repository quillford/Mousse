var Networkdetectmodal = Module.extend({

    // The GUI basics were loaded, we can start the modal for scanning
    on_gui_container_loaded: function(){
        // Request authorisation to display a new modal
        gui.modal.add_demand(this, this.display_modal);
        gui.modal.add_demand(this, this.display_modal);
        gui.modal.add_demand(this, this.display_modal);


    },

    // We were allowed by the modal queue to display the modal
    display_modal: function(){
        // Do nothing if we are not scanning
        if( networkdetect.scanning == false ){ 
            gui.modal.current_modal_closed();     
            return; 
        }

        // Display the new modal
        $(this.asset('modal')).appendTo("#current_modal");
        $("#networkdetectmodal").modal();
    },

    // The networkdetect module started pinging a new IP
    on_networkdetect_scan_new_ip: function( ip ){
        console.log(ip);
        // Make a new label for this IP
        var label = $("<span class='label label-default' style='float:left; margin-right:5px; margin-bottom:5px'></span>");
        label.text(ip);

        // Add the label to the list
        label.appendTo("#scanning_ips").hide().fadeIn();

    }, 

    // The networkdetect module finished pinging an IP
    on_networkdetect_ip_scanned: function( answer ){
        // Find the right IP label
        var label = $("span.label:contains('" + answer.ip + "')");

        // Set a class depending on wether the IP answered or not
        label.removeClass("label-default");
        if( answer.valid ){ label.addClass("label-success"); }else{ label.addClass("label-danger"); }

        // Hide this label
        label.fadeOut();
    },

    // All IPs have been scanned
    on_networkdetect_scan_finished: function(){
        $("#currently_scanning").slideUp();
    } 




}); 

