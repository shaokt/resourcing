import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    viewType: "assignment",
    viewType: "timeaway",
    leftScroll: 0,
    minLeft: 0, // the minimum left position to show names when scrolling

    assignments: [
        {
            class: "aem",
            name: "AEM",
            long: "Adobe Experience Manager",
            background: "#f9aff8"
        },
        {
            class: "aem",
            name: "AEM",
            long: "Adobe Experience Manager",
            background: "#f9aff8"
        }
    ],

    init: function(){
        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();
    }.on('init'),

    scrolled: function(){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.viewType == 'timeaway' ? this.minLeft : left)
        $('.calendar').css({left:-left})
    },

    mouseMoved: function(event){
    	var pos = event.pageX - 75; // 75 determined via css margin/padding page offset
        var max = this.constants.calWidth - this.constants.DIM;
    	pos = pos - pos%this.constants.DIM;
    	pos <= 0 ? pos = 0 : 0;
		pos = pos >= max ? max : pos;
        this.set('mousePos', pos)
    }
});
