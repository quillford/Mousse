var Module = Class({

    // Get an asset's html element from 
    asset: function(path){
        path = path.split('/').join('-'); 
        path = this.name + "-" + path; 
        return $("#assets").find("#" + path); 
    }




});



