var Filesystemfile = new Class({

    create: function( path ){
        this.path = path;
        this.filename = path.match(/([^\\]*)$/g);
    },

    is_folder: function(){
        return false;
    }

});
