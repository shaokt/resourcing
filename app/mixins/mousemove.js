import Ember from 'ember';

export default Ember.Mixin.create({
    bindMouseMove: function() {
        var onMouseMove, _this = this;

        onMouseMove = function(event){
            return _this.mouseMoved(event);
        };

        setTimeout(function(){ Ember.$('main').bind('mousemove', onMouseMove); }, 0);
    }
});
