import Ember from 'ember';
import WebcelMixin from "../mixins/webcel";

export default Ember.Component.extend(WebcelMixin, {
    tagName:'div',
    classNames: ['calendar'],
    year: 2016,
    today: new Date(),
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
    	var year = this.today.getFullYear();
    	var month = ("0" + (this.today.getMonth() + 1)).slice(-2);
    	var day = this.today.getDate();
    	var date = this.getDate(year, month, day);
      this.set('constants.todayDate', day);
    	date.week.addClass("selected");
    	date.month.addClass("selected");
        var self = this;
        date.week.attr("tabindex", 0)
        this.set('constants.todayColumn', date.week.attr("data-column"));

        this.scrollToday(500);
        $('#todayDateLine').css({left:parseInt(date.week.attr('data-column'))})
    },

    // scroll to today
    scrollToday:function(time){
        var self = this;
    	setTimeout(function(){ $(window).scrollLeft(self.constants.todayColumn - (self.constants.DIM*22) );}, time);
    },

    // figure out which column in the calendar to select
    getDate:function(year, month, day){
    	var month = this.calendar.find("[data-date='" + year + " " + month + "']");
    	var week = null;
    	$(month).find(".day").each(function(){
    		week == null ? week = $(this) : 0;
    		if(day >= +($(this).text().match(/\d+/)[0])){ week = $(this); }
    	})
    	return {month:month, week:week};
    },

    // reset global values when re-rendering a calendar
    reset:function(){
        this.constants.numDays=0;
        this.constants._DIM=-this.constants.DIM;
        this.constants.prevYear = 0;
        this.constants.nextYear = 0;
    },

    didRender: function() {
        Ember.run.scheduleOnce('afterRender', this, 'onload');
    },

    // customize page after calendar loads
    onload() {
        this.constants.webcel = this.Webcel();
        this.set('constants.calWidth', ((this.constants.numDays) * this.constants.DIM));
        $('#pageContainer').css({width:this.constants.calWidth});
        $('.calendar').css({width:this.constants.calWidth});

        this.calendar = $('#' + this.attrs.elementId);
        this.highlightToday();

        this.constants.daily = this.daily;
        if(this.daily){
            if(!this.holidays.year){
                this.holidays.year = this.year;
                this.holidays.getDates();
            }
            this.holidays.display();
        }
        this.reset();
    }
});
