import Ember from 'ember';

export default Ember.Mixin.create({
    _self: this,
    bindKeyDown: function() {
        var onKeyDown, _this = this;

        onKeyDown = function(event){
            return _this.keyDown(event, true);
        };

        $(window).bind('keydown', onKeyDown);
    },

    unbindKeyDown: function() {
        $(window).unbind('keydown');
    }
});
