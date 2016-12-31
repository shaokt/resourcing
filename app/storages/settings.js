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
        return this.get('showHiddenRows');
    }.property('showHiddenRows')
});

Storage.reopenClass({
    initialState() {
        return {
            view: "timeaway",
            assignmentTile: "empty",
            timeawayTile: "vacation",
            lastManager: "",
            gridLines: false,
            showHiddenRows: false
        };
    }
});

export default Storage;
