export default Ember.Service.extend({
    DIM: 15,            // width of each day
    _DIM: -15,
    calWidth: 0,        // calendar width
    numDays: 0,         //number of days rendered on calendar
    todayColumn: null,  // today's column on the calendar
    webcel:null         //singleton Webcel object - only one editable instance at a time
});
