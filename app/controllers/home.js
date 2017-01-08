import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    counterCSS: '',
    minLeft: 0, // the minimum left position to show names when scrolling
    settings: storageFor("settings"),
    queryParams: ['id', 'year'],
    id:null,
    year: null,

    hasFile: Ember.computed('model.resource', function(){
        return this.get('model.resource.length') > 0;
    }),

    // update the title based on view for the manager
    setTitle: Ember.observer('settings.view', function(){
        document.title = `${this.get('year')} ${this.get('settings.lastManager')} ${this.get('settings.view') === 'timeaway' ? ' | Time Off' : ' | Roadmap'}`;
    }),

    // determines which assignment to show while viewing employees
    showAssignment: function(){
        var self = this;
        this.set('viewAssignment',[]);
        this.get('model.assignment').forEach(function(item){
            if(Ember.$.inArray(item.id, self.get('constants.assArray')) !== -1){ self.viewAssignment.push(item); }
        });

        this.set('numAssignmentsViewing', this.get('viewAssignment').length * 40); // 40=height of each assignment row
        return this.get('settings.isWeeklyCalendar') && this.get('viewAssignment').length > 0;

    }.property('settings.isWeeklyCalendar', 'constants.assArray'),

    init() {
        this._super();

        Ember.run.scheduleOnce("afterRender",this,()=>{
            this.setTitle();
            var self = this;
            var result = "";
            var vacationCounters = ['lieu', 'personal', 'sick', 'unofficial'];
            var vacationCountersPrevious = ['vacationCarryover'];
            Ember.$.each(vacationCounters, function(i, val){
            	result += '.tiles .' + val + '[data-year="' + self.get('year')+ '"] { counter-increment:' + val + 'Counter } ';
            });
            Ember.$.each(vacationCountersPrevious, function(i, val){
            	result += '.tiles .' + val + '[data-year="' + (self.get('year')-1) + '"] { counter-increment:' + val + 'Counter } ';
            });
            self.set('counterCSS', result);
        });

        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();

    },

    scrolled: function(){ this.constants.scrolled(this.minLeft); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); },

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
