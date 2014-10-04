var Filesystemfolder = new Class({

    create: function( path ){
        this.path = path;
        this.children = [];

        // Extract the folder name for displaying by GUI
        this.text = path.match(/[^\/]+$/g);

        // Always open the "sd" folder for convenience
        if( this.text == "sd" ){
            this.state = { opened: true };
        }

    },

    is_folder: function(){
        return true;
    }

});
