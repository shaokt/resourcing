import Ember from 'ember';

export default Ember.Mixin.create({
    _self: this,
    bindScrolling: function(opts) {
        var onScroll, _this = this;

        onScroll = function(){
            return _this.scrolled();
        };

        $(document).bind('touchmove', onScroll);
        $(window).bind('scroll', onScroll);
    },

    unbindScrolling: function() {
        $(window).unbind('scroll');
        $(document).unbind('touchmove');
    }
});
