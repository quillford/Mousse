var Networkdetect = Module.extend({
   
    on_module_loaded: function(){
        // Scan several local ranges of IPs at the same time
        for( var range in [0,1] ){
            for( var terminator in [0,1,2] ){
                this.scan_ip("192.168." + range + "." + terminator ); 
            }
        }
    },
    
    scan_ip: function( ip ){
        // Check this IP for an answer, if it answers it's potentially a Smoothieboard
        $.ajax({ 
            url: "http://" + ip + '/command', 
            timeout: 1000, 
            caller: this,
            type: "POST",
            data: "version\n"
        }).done( this.ip_answered ).fail( this.ip_failed );
 
    },
 
    ip_answered: function( data, state, xhr ){
        // This IP answered, it may be good, check it's validity, and explore a new one
        var ip = this.url.split('/')[2];

        // Did that IP answer in a valid way
        if( data.match("Build date") ){
            this.caller.found_valid_ip.call( this.caller, ip, data );
        }

        // Explore the next IP adress
        this.caller.explore_next_ip.call( this.caller, ip );
    },

    ip_failed: function( xhr, status ){
        // This IP did not answer or returned an error, explore the next one
        var ip = this.url.split('/')[2];

        // Explore the next IP adress
        this.caller.explore_next_ip.call( this.caller, ip );
    },

    explore_next_ip: function( ip ){
        // Increment the IP adress
        var exploded = ip.split('.');
        exploded[3] = Number(exploded[3]) + 3;

        // Don't explore passed what is reasonable
        if( exploded[3] > 255 ){ return; }

        // Scan the new IP
        this.scan_ip( exploded.join('.') );
    },

    found_valid_ip: function( ip, data ){
        
        $('body').html(ip + " " + data);


    }




});



