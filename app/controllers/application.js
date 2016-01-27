import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    counterCSS: '',
    leftScroll: 0,
    minLeft: 0, // the minimum left position to show names when scrolling

    config: {
        view: "timeaway",
        timeawayTile: "vacation",
        showHiddenRows: true
    }, // config settings for user session

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

    //setupSomething: Ember.on('init', function(){

    init() {
        this._super();

        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();

        //TODO: dynamic year
        this.year=2015
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


    // }.on('init'),

    scrolled: function(){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.get('config.view') == 'timeaway' ? this.minLeft : left)
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
        updateName(resource) {
            //debugger;
            console.log(this.get('model').findBy('id', '1').get('name'))
            //this.get('model').save();
            //console.log(resource.get('name'));
            //console.log(this.get('store').findAll('resource', 1))
            /*
            this.store.findAll('config')
            console.log(this.config[0].get('view'))
            this.config[0].set('view', 'assignment')
            this.config[0].save()
            /**/
        }
    }
});
