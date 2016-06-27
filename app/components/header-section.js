import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    showTeam: false,

    init() {
        this._super();
        if(this.get('router.currentRouteName') === 'assignments.index')
        this.set('showTeam', true)
    },

    actions: {
        //
        viewTeam() {

        },

        // scroll today's column into view
        scrollToday() {
            this.cal.scrollToday();
        },

        addAssignment(){
            this.sendAction('addAssignment');
        },

        addEmployee(){
            this.sendAction('addEmployee');
        },

        // switch views between assignment, timeaway etc
        toggleView(view) {
            this.get('settings').set('view', view)
            document.title = this.get('settings.view') == "timeaway" ?
                "Resourcing - Time Off" :
                "Resourcing - Assignments";
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
