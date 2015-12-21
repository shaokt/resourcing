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
