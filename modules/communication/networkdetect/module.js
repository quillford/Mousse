var Networkdetect = Module.extend({
   
    on_module_loaded: function(){
        // Set up a hash of valid IPs found ( this session ) so that we don't report the same IP found twice
        this.found_ips = {};

        // Retrieve a list of previously ( in other sessions ) found IP adresses and see if they answer
        // This is faster than just trying to find everyone again
        var previous_ips = $.localStorage.getItem('previous_ips');
        if( previous_ips ){
            var previous_ips = previous_ips.split(',');
            for( var index in [previous_ips] ){
                this.scan_ip({ip: previous_ips[index], mode: 'single'}); 
            }
        }

        // Scan several local ranges of IPs at the same time
        for( var range in [0,1] ){
            for( var terminator in [0,1,2] ){
                this.scan_ip({ip:"192.168." + range + "." + terminator, mode:'exploration'}); 
            }
        }

    },
    
    scan_ip: function( attempt ){
        // Check this IP for an answer, if it answers it's potentially a Smoothieboard
        $.ajax({ 
            url: "http://" + attempt.ip + '/command', 
            timeout: 1000, 
            caller: this,
            type: "POST",
            data: "version\n",
            mode: attempt.mode
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
        if( this.mode == 'exploration' ){
            this.caller.explore_next_ip.call( this.caller, ip );
        }
    },

    ip_failed: function( xhr, status ){
        // This IP did not answer or returned an error, explore the next one
        var ip = this.url.split('/')[2];
        
        // Explore the next IP adress
        if( this.mode == 'exploration' ){
            this.caller.explore_next_ip.call( this.caller, ip );
        }
    },

    explore_next_ip: function( ip ){
        // Increment the IP adress
        var exploded = ip.split('.');
        exploded[3] = Number(exploded[3]) + 3;

        // Don't explore passed what is reasonable
        if( exploded[3] > 255 ){ return; }

        // Scan the new IP
        this.scan_ip({ip: exploded.join('.'), mode:'exploration'});
    },

    found_valid_ip: function( ip, data ){
        
        // Check if this IP was previously found
        if( this.found_ips[ip] ){
           return;
        }

        // Mark this IP as found so we don't find it again
        this.found_ips[ip] = data;

        $('body').append('/' + ip + " " + data);

        // Add this IP to the list of IPs found in local storage so we find it faster next time
        var previous_ips = $.localStorage.getItem('previous_ips');
        if( previous_ips ){
            previous_ips = previous_ips.split(',');
        }else{
            previous_ips = [];
        }

        // If this IP is not already in the list, add it to the list
        if( previous_ips.indexOf(ip) == -1 ){
            previous_ips.push(ip);
            previous_ips = previous_ips.join(',');
            $.localStorage.setItem('previous_ips', previous_ips);
        }

    }

});



