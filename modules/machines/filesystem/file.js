var Filesystemfile = new Class({

    create: function( path ){
        this.path = path;
        this.filename = path.match(/[^\/]+$/g);
        
        // What will be displayed by the GUI
        this.text = this.filename;
    },

    is_folder: function(){
        return false;
    }

});
