import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'div',
    classNames: ['calendar'],
    year: 2015,
    today: new Date(),
    type: "weekly",
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
            year: -1,
            quarter: "Q1",
            months:{"Nov":0, "Dec":0, "Jan":0 }
        },
        {
            quarter: "Q2",
            months: {"Feb":0, "Mar":0, "Apr":0}
        },
        {
            quarter: "Q3",
            months: {"May":0, "Jun":0, "Jul":0}
        },
        {
            quarter: "Q4",
            months: {"Aug":0, "Sep":0, "Oct":0}
        },
        {
            year: 1,
            quarter: "Q1",
            months: {"Nov":0, "Dec":0, "Jan":0}
        }
    ],

    // determines the last day in the given month
    getLastDayInMonth:function(month){
        this.lastDay = (new Date(this.year, this.months[month], 0).getDate());
    },

    // determines if the day 1-31 of the month is a M, T, W, R, F
    setDate:function(year, month, index){
        this.dayName = this.dayNames[(new Date(year, this.months[month] -1 , index).getDay())];
        this.dayNum = index;
    },

    // pad all dates to two digits
    padSingleDates:function(num){
        return num < 10 ? "0" + num: num;
    },

    // highlight today in the calendar
    highlightToday:function(){
    	var year = this.today.getFullYear();
    	var month = ("0" + (this.today.getMonth() + 1)).slice(-2);
    	var day = this.today.getDate();
    	var date = this.getDate(year, month, day);
    	date.week.addClass("selected");
    	date.month.addClass("selected");
        var self = this;
    	setTimeout(function(){
    		date.week.attr("tabindex", 0).focus();
    		$(window).scrollLeft(date.week.attr("data-column") - (self.constants.DIM*22) );
    	}, 500);
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

    // customize page after calendar loads
    didRender() {
        $('#pageContainer').css({width:((this.constants.numDays + 2) * this.constants.DIM) +"px"});
        this.calendar = $('#' + this.attrs.elementId);
        this.highlightToday();
        //move to reset
        this.constants.numDays=0;
        this.constants._DIM=0;
    }
});
