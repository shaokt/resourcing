import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',

    isWeeklyCalendar: function(){
        return this.get('config.view') === 'assignment';
    }.property('config.view'),

    isDailyCalendar: function(){
        return this.get('config.view') === 'timeaway';
    }.property('config.view'),

    actions: {
        scrollToday() {
            this.cal.scrollToday();
        },

        toggleView() {
            this.set("config.view", this.get('isWeeklyCalendar') ? "timeaway": "assignment");
        }
    }
});
