import Ember from 'ember';

export default Ember.Mixin.create({
    bindScrolling: function() {
        var onScroll, _this = this;

        onScroll = function(){
            return _this.scrolled();
        };

        Ember.$(document).bind('touchmove', onScroll);
        Ember.$(window).bind('scroll', onScroll);
    },

    unbindScrolling: function() {
        Ember.$(window).unbind('scroll');
        Ember.$(document).unbind('touchmove');
    }
});
