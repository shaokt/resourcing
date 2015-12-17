import Ember from 'ember';

export default Ember.Component.extend({
    isWeeklyCalendar: function(){
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isDailyCalendar: function(){
        return this.get('viewType') === 'timeoff';
    }.property('viewType'),
});
