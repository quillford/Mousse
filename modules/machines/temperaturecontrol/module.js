var Temperaturecontrol = Module.extend({

    on_config_parsed: function( machine ){
        this.parent_machine = machine;
        machine.temperaturecontrol = this;
        console.log("test");
    }

});



