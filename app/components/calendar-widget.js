import Ember from 'ember';
import WebcelMixin from "../mixins/webcel";
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend(WebcelMixin, {
    tagName:'div',
    classNames: ['calendar'],
    settings: storageFor("settings"),
    year: Ember.computed('_year', function(){
        return parseInt(this.get('_year'));
    }),

    today: new Date(),
    teamDate:null,  //column in calendar indicating day/week the team view starts for given assignment
	dayNames: ["S", "M", "T", "W", "R", "F", "S"],
    months: {
        "Jan" : "01",
        "Feb" : "02",
        "Mar" : "03",
        "Apr" : "04",
        "May" : "05",
        "Jun" : "06",
        "Jul" : "07",
        "Aug" : "08",
        "Sep" : "09",
        "Oct" : "10",
        "Nov" : "11",
        "Dec" : "12"
    },
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdays: ["M", "T", "W", "R", "F"],
    quarters: [
        {
            year: 0,
            quarter: "Q1",
            months:{"Nov":-1, "Dec":-1, "Jan":0 }
        },
        {
            year: 0,
            quarter: "Q2",
            months: {"Feb":0, "Mar":0, "Apr":0}
        },
        {
            year: 0,
            quarter: "Q3",
            months: {"May":0, "Jun":0, "Jul":0}
        },
        {
            year: 0,
            quarter: "Q4",
            months: {"Aug":0, "Sep":0, "Oct":0}
        },
        {
            year: 1,
            quarter: "Q1",
            months: {"Nov":0, "Dec":0, "Jan":1}
        },
        {
            year: 1,
            quarter: "Q2",
            months: {"Feb":1, "Mar":1, "Apr":1}
        },
        {
            year: 1,
            quarter: "Q3",
            months: {"May":1, "Jun":1, "Jul":1}
        }
    ],

    // determines the last day in the given month
    getLastDayInMonth:function(year, month){
        this.lastDay = (new Date(year, this.months[month], 0).getDate());
    },

    // determines if the day 1-31 of the month is a M, T, W, R, F
    setDate:function(year, month, index){
        this.dayName = this.dayNames[(new Date(year, this.months[month] -1 , index).getDay())];
        this.dayNum = index;
    },

    // highlight today in the calendar
    highlightToday:function(){
        try{
        	var year = this.today.getFullYear();
        	var month = ("0" + (this.today.getMonth() + 1)).slice(-2);
        	var day = this.today.getDate();
        	var date = this.getDate(year, month, day);
            this.set('constants.todayDate', day);
        	date.week.addClass("selected");
        	date.month.addClass("selected");
            date.week.attr("tabindex", 0);
            this.set('constants.todayColumn', date.week.attr("data-column"));
            this.setTeamDate(date);
            if(!this.get('constants.teamAssignmentView')){ this.scrollToday(500); }
            this.set('viewingCurrentYear', true);
        }catch(e){
            // viewing earlier / future years where "today" doesn't exist in that calendar
            Ember.$('[data-type="todayDateLine"]').css({display:'none'});
            this.set('viewingCurrentYear', false);
        }
    },

    // set the team date indicator
    // shows from which date the user wants to see the team working on an assignment
    setTeamDate(date) {
        //if not set, set default column date to this week on load
        if(this.get('constants.todayColumnDate') === null) {
            this.set('constants.todayColumnDate', date.week);
        }
        else { // if user selected another date, find the date in the calendar as the views change
            this.set('constants.todayColumnDate',
                this.calendar.find("[data-date='" +
                this.get('constants.todayColumnDate').attr('data-date')+ "']"));
        }

        this.teamDateSelect(date);

        // in the timeaway view, add the teamDate class one level lower
        if(this.get('settings.view') === 'timeaway' && this.get('router.currentRouteName') === 'roadmap.index'){
            var teamDate = Ember.$(this.get('constants.todayColumnDate').find('.dayNum')).addClass('teamDate').parent();
            teamDate.attr('tabindex',0).focus();

            Ember.$(window).scrollLeft(teamDate.attr('data-column') - (this.constants.DIM*22));
        }
    },

    teamDateSelect(date) {
        // if the user refreshes in the dailyview, there is a bug where we need to reset the column
        // somehow this function is being called twice if refreshing form assignmentview
        // TODO: fix bug where calendar loads twice and we can remove this try/catch block
        try{ this.get('constants.todayColumnDate')[0].click(); }
        catch(e){
            this.set('constants.todayColumnDate', date.week);
            this.get('constants.todayColumnDate')[0].click();
        }
    },

    // scroll to today
    scrollToday:function(time){
        var self = this;
    	setTimeout(function(){ Ember.$(window).scrollLeft(self.constants.todayColumn - (self.constants.DIM*22) );}, time);
    },

    // figure out which column in the calendar to select
    getDate:function(year, month, day){
    	month = this.calendar.find(".quarter .month[data-date='" + year + " " + month + "']");
    	var week = null;
    	Ember.$(month).find(".day").each(function(){
    		if(day >= +(Ember.$(this).text().match(/\d+/)[0])){ week = Ember.$(this); }
    	});

        /* the current day preceeds the first Monday of the month in weekly view
         * i.e. Mon Jan 30, Tues Jan 31, Wed Feb 1, whereas the logic above would find Mon Feb 6th which isn't the current week
        */
        if(week === null) {
            month = Ember.$(month).parent().prev().find('.month').last();
            week = month.find('.day').last();
        }

    	return {month:month, week:week};
    },

    // reset global values when re-rendering a calendar
    reset:function(){
        this.constants.numDays=0;
        this.constants._DIM=-this.constants.DIM;
        this.constants._prevYear = 0;
        this.constants._nextYear = 0;
    },

    didRender: function() {
        Ember.run.scheduleOnce('afterRender', this, 'onload');
    },

    // customize page after calendar loads
    onload() {
        const cal = Ember.$('.calendar');
        this.constants.webcel = this.Webcel();
        this.set('constants.calWidth', ((this.constants.numDays) * this.constants.DIM));
        Ember.$('#pageContainer').css({width:this.constants.calWidth}).attr('data-q1-start', cal.find('.day').attr('data-day-name'));
        cal.css({width:this.constants.calWidth});

        this.calendar = Ember.$('#' + this.attrs.elementId);
        this.highlightToday();

        this.constants.daily = this.daily;
        if(this.daily){
            if(!this.holidays.year){
                this.holidays.year = this.get('year');
                this.holidays.getDates();
            }
            this.holidays.display();
        }
        this.reset();
    }
});
