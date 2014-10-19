var Dropboxclient = Module.extend({
   
    on_module_loaded: function(){
        // Wether we are connected to dropbox or not
        this.connected = false;

        // Set up a client
        this.client = new Dropbox.Client({ key: "fntkzm2l7q480wp" }); 
 
        // Set up authdriver
        this.auth_driver = new Dropbox.AuthDriver.Redirect({ rememberUser: true });
        this.client.authDriver( this.auth_driver );
    
        // Authenticate 
        var _that = this;
        this.client.authenticate({ interactive: false }, function (error, client) {
            if (error) {
                console.log("dropbox error in non-interactive auth");
                _that.client.reset();
            }else{
                _that.authenticated(); 
            }
        }); 
    },

    // Take the user to Dropbox for authentication
    on_go_to_dropbox_for_auth: function(){
        // Authenticate 
        var _that = this;
        this.client.authenticate({ interactive: true }, function (error, client) {
            if (error) {
                console.log("dropbox error in interactive auth");
                _that.client.reset();
            }else{
                _that.authenticated();
            }
        }); 

    },

    // We have been succesfully authenticated with Dropbox
    authenticated: function(){
        var _that = this;
        this.client.readdir("/", function(error, entries, stat, entry_stats ) {
            if (error) {
                 console.log("dropbox error after succesful auth");
                _that.client.reset();
            }else{
                // Remember we connected succesfully
                _that.connected = true;

                // Tell other modules we are connected now
                kernel.call_event("on_dropbox_authenticated");

                console.log([ entries, stat, entry_stats ]);

                // Explore the new file system
                _that.explore_filesystem();
            }
        });
    },

    explore_filesystem: function(){
        // Create the root of the filesystem
        this.root = new Filesystemfolder('/');
        this.root.explored = false;

        // Name this filesystem for display in GUIs
        this.root.text = "Dropbox"; 

        // Also show it as open
        this.root.state = { opened: true };

        // Make sure it knows where it came from
        //this.root.parent = this;

        // Attribute the correct filesystem id
        this.root.filesystem_id = this.kernel.filesystems.length;

        // Make sure the kernel knows about it
        this.kernel.filesystems.push(this.root);

        // On a regular basis, try to go further into the filesystem
        var _that = this; 
        setInterval(function(){
            if( _that.scanning ){return;}
            _that.scanning = true;
            _that.continue_exploration.call(_that,_that.root);
            _that.scanning = false;
        },100);
    },

    // Descend the filesystem until we find something we have not explored, or we have finished
    continue_exploration: function( folder ){
        var parent_folder = folder;

        // If explored, descend into it and try to explore, if not explored, explore 
        if( folder.explored ){
            // Explore each of the folders contained in this folder
            for( var index in folder.children ){
                var child = folder.children[index];

                // Explore only folder, obviously
                if( child.is_folder() ){
                    var abort_exploration = this.continue_exploration(child);
                    if( abort_exploration ){ return true; }
                } 
            }
        }else{
            // This folder was never explored before, we return true to make sure we don't explore further this time, and do the ajax request to explore this folder
            this.client.readdir(folder.path, function(error, entries, stat, entry_stats ) {
                if (error) {
                     console.log("dropbox error after succesful auth");
                    _that.client.reset();
                    return;
                }
                // Exploring this folder, we append files and folders to it 
                for( var index in entry_stats ){
                    var result = entry_stats[index]; 
                    if( result == "" ){ continue; }
                    // We have a new line ! We must append it to the list of children for this folder
                    if( result.isFolder ){
                        // Make a new folder
                        var folder = new Filesystemfolder(result.path);
                        folder.explored = false;

                        // Add to the calling folder
                        parent_folder.children.push(folder);

                        // Remember our filesystem
                        folder.filesystem_id = parent_folder.filesystem_id;

                        // Make sure the folder recalls it's parent
                        folder.parent_id = parent_folder.id; 

                        // Warn other modules that the structure changed
                        kernel.call_event("on_filesystem_folder_update", folder);
                    }else{
                        // Get the filename
                        var filename = result.name;

                        // This is a file, make a file
                        var file = new Filesystemfile(result.path); 

                        // Make sure the file recalls it's parent
                        file.parent_id = parent_folder.id;

                        // Remember our filesystem
                        file.filesystem_id = parent_folder.filesystem_id;

                        // Set the file's size
                        file.filesize = result.path;

                        // Add to the calling folder
                        parent_folder.children.push(file); 
                    } 
                }
            });
            folder.explored = true;
            return true;
        }





    }



});



