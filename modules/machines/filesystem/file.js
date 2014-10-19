var Filesystemfile = new Class({

    create: function( path ){
        this.path = path;
        this.filename = path.match(/[^\/]+$/g);
        
        // What will be displayed by the GUI
        this.text = this.filename;

        // Set style
        this.li_attr = {
            'class': 'hidden',
        };
        this.a_attr = {
            'class': 'hidden'
        };

        // Generate an ID
        this.id = Math.random().toString().split('.')[1];

    },

    is_folder: function(){
        return false;
    },

    // Convert this file's size into a human-readable format
    human_filesize: function(){
        var fileSizeInBytes = this.filesize;
        var i = -1;
        var byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);
        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }

});
