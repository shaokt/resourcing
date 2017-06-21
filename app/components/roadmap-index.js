import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
    tagName:'',
    currentAssignment:0,
    persons: [],
    queryParams: ['year'],
    year: null,
    settings: storageFor("settings"),

    isEmpty: Ember.computed('model.assignment', function(){
        return this.get('model.length') === 0;
    }).property('model.assignment.length'),

    assignmentViewContainer: function(){
        return this.get('settings.isDailyCalendar') === true ? "assignmentViewContainer" : "";
    }.property('settings.isDailyCalendar'),

    numAssignmentsViewing: function(){
        let height = this.get('constants.teamAssignment.rows');
        height = height ? (height*15)+60 : 60; // 60=height of each assignment row
        return height + 25; // 25px to account for the project name now being on top of the row
    }.property('constants.teamAssignment')
});
