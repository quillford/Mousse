// This object retrieves a list of files from a machine, and stores it
var Machinefilesystem = new Class({

    create: function( machine ){
        this.parent_machine = machine;
    },

    // Retrieve ( recursively ) a list of files from the machine
    get_filesystem: function(){
        // Create the root of the filesystem
        this.root = new Filesystemfolder('');
        this.root.explored = false;

        // Name this filesystem for display in GUIs
        this.root.text = this.parent_machine.ip; 

        // Also show it as open
        this.root.state = { opened: true };

        // On a regular basis, try to go further into the filesystem
        var _that = this; 
        setInterval(function(){
            _that.continue_exploration.call(_that,_that.root);
        },100);
    },

    // Descend the filesystem until we find something we have not explored, or we have finished
    continue_exploration: function( folder ){

        // If explored, descend into it and try to explore, if not explored, explore 
        if( folder.explored ){
            // Don't explore if the queue is busy
            if(this.parent_machine.interface.is_busy()){ return false; }

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
            this.parent_machine.interface.send_command({
                command: "ls -s " + folder.path + "\n",
                caller: this,
                pass_along: {folder: folder},
                done: function( request, answer ){
                    // Exploring this folder, we append files and folders to it 
                    var results = answer.split("\r\n");
                    for( var index in results ){
                        var result = results[index].replace(/\s$/g,''); 
                        if( result == "" ){ continue; }
                        // We have a new line ! We must append it to the list of children for this folder
                        if( result.match(/\/$/g) ){
                            // This is a folder
                            result = result.replace(/(\/)$/g, '');

                            // If there was an error
                            if( result.match(/not open/g) ){ continue; }

                            // Make a new folder
                            var folder = new Filesystemfolder(request.pass_along.folder.path + "/" + result);
                            folder.explored = false;

                            // Add to the calling folder
                            request.pass_along.folder.children.push(folder); 
                        }else{
                            // Get the filesize
                            var filesize = result.match(/^.+\s(\d*)$/)[1];

                            // Get the filename
                            var filename = result.match(/^(.+)\s\d*$/)[1];

                            // This is a file, make a file
                            var file = new Filesystemfile(request.pass_along.folder.path + "/" + filename); 

                            // Set the file's size
                            file.filesize = filesize;

                            // Add to the calling folder
                            request.pass_along.folder.children.push(file); 
                        } 
                    }
                },
            });
            folder.explored = true;
            return true;
        }

    }





});
