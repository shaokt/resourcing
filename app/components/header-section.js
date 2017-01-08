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
    yearNextFile: true,
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

        this.set('constants.year', this.get('year'));

        var route = this.get('router.currentRouteName');
        if(route === 'roadmap.index'){
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', true);
            this.set('showOrg', true);
            this.set('showTeam', true);
            this.set('showToggleRows', false);
        }
        else if(route === 'roadmap.edit') {
            this.set('showAddEmployee', false);
            this.set('showEmployeeTracking', false);
            this.set('showSort', false);
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

        if(!this.get('viewingCurrentYear')) {
            this.set('constants.disableEditing', true);
            this.set('yearHome', `&year=${this.get('year')}`);
            this.set('yearRoadmap', `?year=${this.get('year')}`);
            this.set('yearNext', parseInt(this.get('year'))+1);
            this.getNextYearFile();
        }
    },

    // check if the next year's file exists
    getNextYearFile: function() {
        var filename = this.get('showAddEmployee') ? this.get('settings.lastManager') : 'assignments';
        var exists = Ember.$.getJSON(`http://localhost:3000/exists/${this.get('yearNext')}/${filename}`, ()=> {})
        .done(()=> {
            if(!exists.responseJSON) { // file doesn't exist
                this.set('yearNextFile', false);
            }
        });
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

        // export current year's file to next year
        exportNextYear(filename) {
            var q1Weekly;   // column value of q1 in weekly view
            var q1Daily;    // column value of q1 in daily view
            var dayNum;     // number of total extra days to account for
            var extraDays;  // extra days to account for when getting values in the weekly & daily view

            var q1 = Ember.$('.calendar').find(`.quarter [data-date="${this.get('year')} 11"] .day`)[0];

            if(this.get('settings.view') === 'roadmap'){
                extraDays = {1:0, 2:0, 3:0, 4:1, 5:2, 6:3, 7:4}; // all posible values for a Monday are 1-7th. If > 3, then need to account for days from previous week
                dayNum = extraDays[parseInt($(q1).find('.dayNum')[0].innerHTML)] * 15;
                q1Weekly = parseInt($(q1).attr('data-column'));
                q1Daily = (q1Weekly*5) - dayNum;
            }
            else {
                extraDays = {M:0, T:4, W:3, R:2, F:1}; // all possible days the month can start on. If not Monday, then need to account for extra days to the next Monday
                dayNum = parseInt(extraDays[$(q1).find('.dayName')[0].innerHTML]) * 15;
                q1Daily = parseInt($(q1).attr('data-column'));
                q1Weekly = (q1Daily + dayNum)/5;
            }

            // if exporting a manager to next year but roadmap isn't exported yet, export roadmap first
            if(this.get('router.currentRouteName') === 'home') {
                var exists = Ember.$.getJSON(`http://localhost:3000/exists/${this.get('yearNext')}/assignments`, ()=> {})
                .done(()=>{
                    if(!exists.responseJSON){
                        Ember.$.getJSON(`http://localhost:3000/makefile/${this.get('yearNext')}/${q1Weekly}/${q1Daily}/assignments`, ()=> {})
                    }
                })
            }

            var create = Ember.$.getJSON(`http://localhost:3000/makefile/${this.get('yearNext')}/${q1Weekly}/${q1Daily}/${filename}`, ()=> {})
            .done(()=> {
                if(create.responseJSON) { // file successfully created
                    this.set('yearNextFile', true);
                }
            });
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
