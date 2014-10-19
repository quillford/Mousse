var Networkdetectmodal = Module.extend({

    // TODO : Add a "manually add a machine" button

    // The GUI basics were loaded, we can start the modal for scanning
    on_gui_container_loaded: function(){
        // Request authorisation to display a new modal
        gui.modal.add_demand(this, this.display_modal);
    },

    // We were allowed by the modal queue to display the modal
    display_modal: function( force ){
        // Do nothing if we are not scanning or the "hide this window on future startups" option was checked
        if( ( networkdetect.scanning == false || $.localStorage.getItem('hide_window_on_future_startups') == "true" ) && force != true ){ 
            gui.modal.current_modal_closed();     
            return; 
        }

        // Display the new modal
        $(this.asset('modal')).appendTo("#current_modal");
        $("#networkdetectmodal").modal();

        // Display currently found machines
        this.display_found_machines();

        // Setup the checkboxes
        this.set_up_checkboxes();
    },

    // The networkdetect module started pinging a new IP
    on_networkdetect_scan_new_ip: function( ip ){
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
        this.display_found_machines();
    },

    // A new machine was found
    on_found_valid_ip: function(){
        this.display_found_machines();
    },

    // Display a list of found IPs in the modal 
    display_found_machines: function(){
        if( kernel.machines.length > 0 ){
            $("#ips_found_list").empty();
            for( var index in kernel.machines ){
                $("<li class='list-group-item'>" + kernel.machines[index].ip + "</li>").appendTo("#ips_found_list");

            }
            $("#ips_found").show();
        }else{
            // Hide the list if nothing was found
            $("#ips_found").hide();
        }
    },

    // Setup the checkboxes in the modal
    set_up_checkboxes: function(){

        // Set the first checkbox. If never defined, set to true by default
        var hide_window_on_future_startups = $.localStorage.getItem('hide_window_on_future_startups'); 
        if( hide_window_on_future_startups == "true" ){
            $("#hide_scan_modal").prop("checked", true);
        }else if( hide_window_on_future_startups == "false" ){
            $("#hide_scan_modal").prop("checked", false);
        }else{
            $("#hide_scan_modal").prop("checked", true);
            $.localStorage.setItem("hide_window_on_future_startups", "true");
        }
        $("#hide_scan_modal").click(function(){
            console.log("test");
            $.localStorage.setItem("hide_window_on_future_startups", ( $("#hide_scan_modal").prop("checked") ? "true" : "false" ));
        });
        // Set the second checkbox. If never defined, set to true by default
        var scan_for_new_machines_on_startup = $.localStorage.getItem('scan_for_new_machines_on_startup'); 
        if( scan_for_new_machines_on_startup == "true" ){
            $("#scan_on_startup").prop("checked", true);
        }else if( scan_for_new_machines_on_startup == "false" ){
            $("#scan_on_startup").prop("checked", false);
        }else{
            $("#scan_on_startup").prop("checked", true);
            $.localStorage.setItem("scan_for_new_machines_on_startup", "true");
        }
        $("#scan_on_startup").click(function(){
            $.localStorage.setItem("scan_for_new_machines_on_startup", ( $("#scan_on_startup").prop("checked") ? "true" : "false" ));
        });
 
    }


}); 

