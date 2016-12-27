import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    showAddEmployee: false,
    showEmployeeTracking: false,
    showSort: false,
    showOrg: false,
    showTeam: false,
    showToggleRows: false,
    showRoadmap: false,
    currentYear: (new Date()).getFullYear(),
    lastManager: Ember.computed.alias('settings.lastManager'),

    init() {
        this._super();

        this.set('yearNext', this.get('settings.year')+1);
        this.set('yearPrev', this.get('settings.year')-1);

        var route = this.get('router.currentRouteName');
        if(route === 'assignments.index'){
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', false);
            this.set('showOrg', true);
            this.set('showTeam', true);
            this.set('showToggleRows', false);
        }
        else if(route === 'assignments.edit') {
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', true);
            this.set('showOrg', true);
            this.set('showTeam', false);
            this.set('showToggleRows', true);

        }
        else if(route === 'home') {
            this.set('showAddEmployee', true);
            this.set('showEmployeeTracking', true);
            this.set('showSort', true);
            this.set('showOrg', false);
            this.set('showTeam', false);
            this.set('showRoadmap', true);
            this.set('showToggleRows', true);
        }
    },

    // determine whether to show assignment tiles or not
    showAssignmentTiles: Ember.computed(function(){
        return this.get('settings.isWeeklyCalendar') || this.get('constants.teamAssignmentView');
    }).property('settings.isWeeklyCalendar'),

    // determine whether to show timeoff tiles or not
    showTimeoffTiles: Ember.computed(function(){
        return this.get('settings.isDailyCalendar') && this.get('router.currentRouteName') === 'home';
    }).property('settings.isDailyCalendar'),

    actions: {
        // view a different year
        changeYear(num){
            this.set('settings.year', this.get('settings.year')+num);
            location.reload();
        },

        currentRoadmap(){
            this.set('settings.year', this.get('currentYear'));
            if(this.get('showOrg')) location.reload();
        },

        currentManager(){
            this.set('settings.year', this.get('currentYear'));
            if(this.get('showRoadmap')) location.reload();
        },

        // allows user to view all team members assigned to a project
        viewTeam() {
            if(this.get('constants.dataView') === 'timeaway'){ return; }
            this.toggleProperty('constants.teamAssignmentView');
            if(!this.get('constants.teamAssignmentView')){
                this.set('constants.teamAssignment', '');
            }
            this.constants.todayColumnDate[0].click();
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
            this.get('settings').set('view', view);
            document.title = this.get('settings.view') === "timeaway" ?
                "Resourcing - Time Off" :
                "Resourcing - Assignments";
        },

        // show/hide hidden rows
        toggleViewHiddenRows() {
            this.get('settings').set('showHiddenRows', !(this.get('settings').get('showHiddenRows')));
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
