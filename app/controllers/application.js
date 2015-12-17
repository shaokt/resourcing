import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling"

export default Ember.Controller.extend(ScrollingMixin, {
    viewType: "timeoff",
    leftScroll: 0,
    minLeft: 0, // the minimum left position to show names when scrolling

    init: function(){
        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
    }.on('init'),

    scrolled: function(){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.viewType == 'timeoff' ? this.minLeft : left)
    }
});
