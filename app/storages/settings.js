import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend({
    isWeeklyCalendar: function(){
        return this.get('view') === 'assignment';
    }.property('view'),

    isDailyCalendar: function(){
        return this.get('view') === 'timeaway';
    }.property('view'),

    hasCalendar: function(){
        return this.get('view') === 'timeaway' || this.get('view') === 'assignment';
    }.property('view'),

    isHiddenRows: function(){
        return this.get('showHiddenRows');
    }.property('showHiddenRows')
});

Storage.reopenClass({
    initialState() {
        return {
            year: (new Date()).getFullYear(), // default to current year
            view: "timeaway",
            assignmentTile: "empty",
            timeawayTile: "vacation",
            lastManager: "",
            showHiddenRows: true
        };
    }
});

export default Storage;
