import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
    counterCSS: '',
    settings: storageFor("settings"),
    queryParams: ['id', 'year'],
    id:null,
    year: null,

    isEmpty: Ember.computed('model.resource', function(){
        return this.get('model.resource.length') === 0;
    }).property('model.resource.length'),

    // update the title based on view for the manager
    setTitle: Ember.observer('settings.view', function(){
        document.title = `${this.get('year')} ${this.get('settings.lastManager')} ${this.get('settings.view') === 'timeaway' ? ' | Time Off' : ' | Roadmap'}`;
    }),

    // determines which assignment to show while viewing employees
    showAssignment: function(){
        var self = this;
        let height = 0;
        this.set('viewAssignment',{"assignment":[]});
        this.get('model.assignment').forEach(function(item){
            if(Ember.$.inArray(item.id, self.get('constants.assArray')) !== -1){
                const rowHeight = item.get('rows');
                height += 25 + (rowHeight ? (rowHeight*15)+60 : 60); // 60=height of each assignment row, 25 = :before pseudo element used for displaying project info
                self.viewAssignment.assignment.push(item);
            }
        });

        this.set('numAssignmentsViewing', height);
        return this.get('viewAssignment.assignment').length > 0;

    }.property('settings.isWeeklyCalendar', 'constants.assArray'),

    init() {
        this._super();

        Ember.run.scheduleOnce("afterRender",this,()=>{
            this.setTitle();
            var self = this;
            var result = "";
            var vacationCounters = ['lieu', 'unofficial'];
            var vacationCountersPrevious = ['vacationCarryover'];
            Ember.$.each(vacationCounters, function(i, val){
            	result += '.tiles .' + val + '[data-year="' + self.get('year')+ '"] { counter-increment:' + val + 'Counter } ';
            });
            Ember.$.each(vacationCountersPrevious, function(i, val){
            	result += '.tiles .' + val + '[data-year="' + (self.get('year')-1) + '"] { counter-increment:' + val + 'Counter } ';
            });
            self.set('counterCSS', result);

            if(!this.get('model.exists')){
                this.get('router').transitionTo('manager-listing', {queryParams: {year:this.get('year')}});
            }
        });
    },

    actions: {
        addEmployee(){
            var newEmployee = this.get('store').createRecord('resource', {
              id: this.constants.createID(),
              name: 'Enter Name',
              hidden: false,
              assignment: "",
              timeaway: ""
            });

            var store = this.get('model').resource;
            newEmployee.save().then(function(){
                store.pushObject(newEmployee._internalModel);
            });
        }
    }
});
