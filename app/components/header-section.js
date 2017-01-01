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
    viewingCurrentYear: Ember.computed(function(){
        return this.get('year') === this.get('currentYear');
    }),
    lastManager1: Ember.computed(function(){
        return this.get('settings.lastManager').split("", 1);
    }),
    lastManager2: Ember.computed(function(){
        this.get('settings.lastManager').match(/.(.*)/);
        return RegExp.$1;
    }),

    init() {
        this._super();

        if(!this.get('viewingCurrentYear')) {
            this.set('constants.disableEditing', true);
            this.set('yearHome', `&year=${this.get('year')}`);
            this.set('yearRoadmap', `?year=${this.get('year')}`);
        }

        var route = this.get('router.currentRouteName');
        if(route === 'roadmap.index'){
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', false);
            this.set('showOrg', true);
            this.set('showTeam', true);
            this.set('showToggleRows', false);
        }
        else if(route === 'roadmap.edit') {
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', true);
            this.set('showOrg', true);
            this.set('showTeam', false);
            this.set('showRoadmap', true);
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
        enableEditing() {
            this.set('constants.disableEditing', false);
        },

        toggleGrid() {
            this.toggleProperty('settings.gridLines');
        },

        // allows user to view all team members assigned to a project
        viewTeam() {
            if(this.get('constants.dataView') === 'timeaway'){ return; }
            this.toggleProperty('constants.teamAssignmentView');
            if(!this.get('constants.teamAssignmentView')){
                this.set('constants.teamAssignment', '');
            }
            try {
                this.constants.todayColumnDate[0].click();
            }catch(e){ // viewing a different year where 'today' doesn't exist
                Ember.$('.calendar').find(`.month[data-date="${this.get('year')} 01"]`).find('.day')[0].click();
            }
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

        // switch views between roadmap or timeaway
        toggleView(view) {
            this.get('settings').set('view', view);
        },

        // show/hide hidden rows
        toggleViewHiddenRows() {
            this.toggleProperty('settings.showHiddenRows');
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
