export default Ember.Service.extend({
    DIM: 15,
    _DIM: -15,
    numDays: 0,
    calWidth: 0,
    webcel:null //singleton Webcel object - only one editable instance at a time
});
