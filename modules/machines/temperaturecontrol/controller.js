var Temperaturecontroller = new Class({

    create: function(temperaturecontrol, name, configuration){
        this.parent_temperaturecontrol = temperaturecontrol;
        this.name = name;
        this.configuration = configuration;
    },

    // Our values were updated by the updater ( from readings from the machine )
    values_updated: function(){


    }

});
