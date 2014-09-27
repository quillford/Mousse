var Networkdetect = Module.extend({
   
    on_module_loaded: function(){
        // Set up a hash of valid IPs found ( this session ) so that we don't report the same IP found twice
        this.found_ips = {};

        // First thing, try to see if the current domain answers
        var domain = String(window.location);
        if( domain.substring(0,4) == 'http' ){
            var domain = domain.split('/')[2];
            this.scan_ip({ip: domain, mode: 'single'}); 
        }

        // Retrieve a list of previously ( in other sessions ) found IP adresses and see if they answer
        // This is faster than just trying to find everyone again
        var previous_ips = $.localStorage.getItem('previous_ips');
        if( previous_ips ){
            var previous_ips = previous_ips.split(',');
            for( var index in [previous_ips] ){
                this.scan_ip({ip: previous_ips[index], mode: 'single'}); 
            }
        }

        // Also see if localhost answers
        this.scan_ip({ip: '127.0.0.1', mode: 'single'}); 

        return;

        // Scan several local ranges of IPs at the same time
        var _that = this;
        setTimeout(function(){
        for( var range in [0,1,2] ){
            for( var terminator in [0,1,2,3,4,5] ){
                _that.scan_ip({ip:"192.168." + range + "." + terminator, mode:'exploration'}); 
            }
        }
        },5000);

    },
    
    scan_ip: function( attempt ){
        // Check this IP for an answer, if it answers it's potentially a machine
        $.ajax({ 
            url: "http://" + attempt.ip + '/command', 
            timeout: ( attempt.mode == 'single' ? 60000 : 500 ) , 
            caller: this,
            type: "POST",
            data: "version\n",
            mode: attempt.mode,
            async: true,
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
        exploded[3] = Number(exploded[3]) + 6;

        // Don't explore passed what is reasonable
        if( exploded[3] > 255 ){ return; }

        // Scan the new IP
        this.scan_ip({ip: exploded.join('.'), mode:'exploration'});
    },

    found_valid_ip: function( ip, data ){
        // Check if this IP was previously found
        if( this.found_ips[ip] ){ return; }

        // Mark this IP as found so we don't find it again
        this.found_ips[ip] = data;


        // Add this IP to the list of IPs found in local storage so we find it faster next time
        var previous_ips = $.localStorage.getItem('previous_ips');
        if( previous_ips ){ previous_ips = previous_ips.split(','); }else{ previous_ips = []; }

        // If this IP is not already in the list local storage listt, add it to that list
        if( previous_ips.indexOf(ip) == -1 ){
            previous_ips.push(ip);
            previous_ips = previous_ips.join(',');
            $.localStorage.setItem('previous_ips', previous_ips);
        }

        // Tell all the other modules that a new machine was found
        this.kernel.call_event('on_machine_discovered', {ip: ip, version: data});
    }
});



