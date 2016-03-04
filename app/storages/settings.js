import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend({
    isWeeklyCalendar: function(){
        return this.get('view') == 'assignment';
    }.property('view'),

    isDailyCalendar: function(){
        return this.get('view') == 'timeaway';
    }.property('view')
});

Storage.reopenClass({
    initialState() {
        return {
            view: "timeaway",
            assignmentTile: "delete",
            timeawayTile: "vacation",
            showHiddenRows: true
        };
    }
});

export default Storage;
