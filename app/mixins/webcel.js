import Ember from 'ember';

export default Ember.Mixin.create({
    row: null, // the current row being edited
    pointer: null, // the square pointer
    _self: this,

    Webcel: function(obj){
        var setup, _this = this;
        return this.setup(obj);
    },

    setup: function(obj){
        var movePointer;
        this.constants.webcel = this;
        this.row = $($(obj.context.parentNode).find('.row')[0]);
        this.pointer = $(this.row).find('.pointer')[0]
        this.maxY = this.constants.daily ? 0 : 45;
        var self = this;

        movePointer = function(e){
    		var x = e.pageX - $(this).offset().left;
    		x = x - x%self.constants.DIM ;
    		var y = e.pageY  - $(this).offset().top;
    		y = y - y%self.constants.DIM;
            y > self.maxY ? y = self.maxY : 0;
			$(self.pointer).css({left:x,top:y});
        }

        $(this.row).bind('mousemove', movePointer);

        return this;
    },

    done: function(){
        this.constants.webcel = null;
    }
});
