import Ember from 'ember';

export default Ember.Mixin.create({
    bindKeyDown: function() {
        var onKeyDown, _this = this;

        onKeyDown = function(event){
            return _this.keyDown(event, true);
        };

        Ember.$(window).bind('keydown', onKeyDown);
    },

    unbindKeyDown: function() {
        Ember.$(window).unbind('keydown');
    }
});
