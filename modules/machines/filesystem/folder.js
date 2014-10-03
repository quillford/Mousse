var Filesystemfolder = new Class({

    create: function( path ){
        this.path = path;
        this.children = [];
    },

    is_folder: function(){
        return true;
    }

});
