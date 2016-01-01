export default Ember.Service.extend({
    DIM: 15,            // width of each day
    _DIM: -15,
    calWidth: 0,        // calendar width
    numDays: 0,         // number of days rendered on calendar
    nextYear: 0,        // next year's column
    todayColumn: null,  // today's column on the calendar
    draggable: false,   // if the rows are drag sortable or not
    webcel:null         // singleton Webcel object - only one editable instance at a time
});
