import Ember from 'ember';

export default Ember.Mixin.create({
    _self: this,
    bindMouseMove: function(opts) {
        var onMouseMove, _this = this;

        onMouseMove = function(event){
            return _this.mouseMoved(event);
        };

        setTimeout(function(){$('main').bind('mousemove', onMouseMove)}, 0)
    }
});
