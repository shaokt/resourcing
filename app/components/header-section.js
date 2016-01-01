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

        // switch views between assignment vs timeaway
        // TODO: additional views like "details"
        toggleView() {
            this.set("config.view", this.get('isWeeklyCalendar') ? "timeaway": "assignment");
        },

        // show/hide hidden rows
        toggleViewHiddenRows() {
            var show = JSON.parse($('#pageContainer').attr('data-show-hidden'));
            show = (show == false ? true : false);
            this.set("config.showHiddenRows", show)
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
