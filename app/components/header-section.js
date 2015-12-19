import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',

    isWeeklyCalendar: function(){
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isDailyCalendar: function(){
        return this.get('viewType') === 'timeoff';
    }.property('viewType'),

    actions: {
        toggleView() {
            if(this.viewType == "assignment"){
                this.set("viewType","timeoff");
            }
            else{
                this.set("viewType","assignment");
            }
        }
    }
});
