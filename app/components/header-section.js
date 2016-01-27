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
        // scroll today's column into view
        scrollToday() {
            this.cal.scrollToday();
        },

        // save the changes made to the model
        saveChanges(){
            //this.sendAction('updateName', this.get('resource'));
            this.sendAction('updateName');
        },

        // switch views between assignment vs timeaway
        // TODO: additional views like "details"
        toggleView() {
            this.set("config.view", this.get('isWeeklyCalendar') ? "timeaway": "assignment");
        },

        // show/hide hidden rows
        toggleViewHiddenRows() {
            this.set("config.showHiddenRows", this.get("config.showHiddenRows") == false ? true : false)
        },

        // enable drag & drop of resource rows
        dragEnable() {
            this.set('constants.draggable', true);
        },

        // disable drag & drop of resource rows
        dragDisable() {
            this.set('constants.draggable', false);
        }
    }
});
