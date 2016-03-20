export default Ember.Service.extend({
    DIM: 15,            // width of each day
    _DIM: -15,
    calWidth: 0,        // calendar width
    numDays: 0,         // number of days rendered on calendar
    prevYear: 0,        // previous year's column
    nextYear: 0,        // next year's column
    todayColumn: null,  // today's column on the calendar
    draggable: false,   // if the rows are drag sortable or not
    webcel:null,         // singleton Webcel object - only one editable instance at a time
	padout: function(number) { return (number < 10) ? '0' + number : number; }, // pad single digits to double (for date use)
    save: function(data){
        var self = this;
        this.set('saving', true)
        data.save()
        setTimeout(function(){self.set('saving', false)}, 500);
    },
    focusInContentEditable: function(currentValue, event){
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(currentValue.element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
