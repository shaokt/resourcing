import Ember from 'ember';

export default Ember.Component.extend({
    active: "false",
    isAssignment: function() {
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isTimeOff: function() {
        return this.get('viewType') === 'timeoff';
    }.property('viewType')
});
