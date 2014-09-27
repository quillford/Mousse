var Robot = Module.extend({

    on_config_parsed: function( machine ){
        this.parent_machine = this;
        machine.robot = this;
    }

});



