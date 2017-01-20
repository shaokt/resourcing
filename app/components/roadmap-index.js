import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
    tagName:'',
    currentAssignment:0,
    persons: [],
    settings: storageFor("settings"),
    assignmentViewContainer: function(){
        return this.get('settings.isDailyCalendar') === true ? "assignmentViewContainer" : "";
    }.property('settings.isDailyCalendar')
});
