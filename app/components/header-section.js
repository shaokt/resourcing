import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',

    isWeeklyCalendar: function(){
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isDailyCalendar: function(){
        return this.get('viewType') === 'timeaway';
    }.property('viewType'),

    actions: {
        scrollToday() {
            this.cal.scrollToday();
        },

        toggleView() {
            if(this.viewType == "assignment"){
                this.set("viewType","timeaway");
            }
            else{
                this.set("viewType","assignment");
            }
        }
    }
});
