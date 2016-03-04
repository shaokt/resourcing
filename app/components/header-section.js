import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',

    actions: {
        // scroll today's column into view
        scrollToday() {
            this.cal.scrollToday();
        },

        addEmployee(){
            this.sendAction('addEmployee');
        },

        // switch views between assignment, timeaway etc
        toggleView(view) {
            this.get('settings').set('view', view)
        },

        // show/hide hidden rows
        toggleViewHiddenRows() {
            this.get('settings').set('showHiddenRows', !(this.get('settings').get('showHiddenRows')))
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
