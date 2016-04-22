import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    counterCSS: '',
    leftScroll: 0,
    minLeft: 0, // the minimum left position to show names when scrolling

    settings: storageFor("settings"),

    init() {
        this._super();

        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();

        document.title += this.get('settings.view') == "timeaway" ? " - Time Off" : " - Assignments";

        //TODO: dynamic year
        this.year=2016
        var self = this;
        var vacationCounters = ['lieu', 'personal', 'sick', 'unofficial', 'vacation'];
        var vacationCountersPrevious = ['vacationCarryover'];
        $.each(vacationCounters, function(i, val){
        	self.counterCSS += '.tiles .' + val + '[data-year="' + self.year+ '"] { counter-increment:' + val + 'Counter } ';
        });
        $.each(vacationCountersPrevious, function(i, val){
        	self.counterCSS += '.tiles .' + val + '[data-year="' + (self.year-1) + '"] { counter-increment:' + val + 'Counter } ';
        });
    },

    scrolled: function(){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.get('settings.view') == 'timeaway' ? this.minLeft : left)
        $('.calendar').css({left:-left})
    },

    mouseMoved: function(event){
    	var pos = event.pageX - 75; // 75 determined via css margin/padding page offset
        var max = this.constants.calWidth - this.constants.DIM;
    	pos = pos - pos%this.constants.DIM;
    	pos <= 0 ? pos = 0 : 0;
		pos = pos >= max ? max : pos;
        this.set('mousePos', pos)
    },

    actions: {
        addEmployee(){
            var newEmployee = this.get('store').createRecord('resource', {
              id: this.constants.createID(),
              name: 'Enter Name',
              hidden: false,
              assignment: "",
              timeaway: "",
            });
            this.constants.save(newEmployee)
        }
    }
});
