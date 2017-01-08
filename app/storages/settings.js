import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend({
    isWeeklyCalendar: function(){
        return this.get('view') === 'roadmap';
    }.property('view'),

    isDailyCalendar: function(){
        return this.get('view') === 'timeaway';
    }.property('view'),

    hasCalendar: function(){
        return this.get('view') === 'timeaway' || this.get('view') === 'roadmap';
    }.property('view'),

    isHiddenRows: function(){
        return this.get(`showHidden${this.get('router.currentRouteName') === 'home' ? 'Employees' : 'Assignments'}`);
    }.property('showHiddenEmployees', 'showHiddenAssignments')
});

Storage.reopenClass({
    initialState() {
        return {
            view: "timeaway",
            assignmentTile: "empty",
            timeawayTile: "vacation",
            lastManager: "",
            gridLines: false,
            showHiddenEmployees: false,
            showHiddenAssignments: false
        };
    }
});

export default Storage;
