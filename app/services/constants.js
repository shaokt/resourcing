import { storageFor } from 'ember-local-storage';
export default Ember.Service.extend({
    settings: storageFor("settings"),
    DIM: 15,            // width of each day
    _DIM: -15,
    dataView: '',       // a way to set the view based on user actions
    calWidth: 0,        // calendar width
    numDays: 0,         // number of days rendered on calendar
    prevYear: 0,        // previous year's column
    _prevYear: 0,       // previous year's column
    nextYear: 0,        // next year's column
    _nextYear: 0,       // next year's column
    todayDate: null,    // today's day number to show in header buttons
    todayColumn: null,  // today's column on the calendar
    todayColumnDate: null,  // today's column's date in the calendar
    holidayColumns: [], // values of holiday column values
    teamAsOf: 0,        // view team members of a project from this date
    teamAsOfDate: '',   // human readable date for team view
    teamAssignment: '', // assignment being viewed by team
    teamAssignmentView:false, // initiate flow to customize view for teams within an assignment
    leftScroll: 0,      // how far left the page is scrolled from the left
    mousePos:0,         // mouse position while hovering over tracker app
    draggable: false,   // if the rows are drag sortable or not
    webcel:null,        // singleton Webcel object - only one editable instance at a time
	padout: function(number) { return (number < 10) ? '0' + number : number; }, // pad single digits to double (for date use)

    // save newly added data to store & display saving indicator
    save: function(data){
        var self = this;
        this.set('saving', true)
        data.save()
        setTimeout(function(){self.set('saving', false)}, 500);
    },

    // create an ID for a new record
    createID: function(){
        var d = new Date();
        var newID = d.getFullYear() + "" + this.padout(d.getMonth()+1) + "" + this.padout(d.getDate()) + "" + this.padout(d.getHours()) + "" + this.padout(d.getMinutes()) + "" + d.getMilliseconds();
        return newID;
    },

    // highlight content in contenteditable fields on focus
    focusInContentEditable: function(currentValue, event){
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(currentValue.element);
        selection.removeAllRanges();
        selection.addRange(range);
    },

    scrolled: function(minLeft){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.get('settings.view') == 'timeaway' ? minLeft : left)
        $('.calendar').css({left:-left})
    },

    mouseMoved: function(event){
    	var pos = event.pageX - 75; // 75 determined via css margin/padding page offset
        var max = this.calWidth - this.DIM;
    	pos = pos - pos%this.DIM;
    	pos <= 0 ? pos = 0 : 0;
		pos = pos >= max ? max : pos;
        this.set('mousePos', pos)
    },
});
