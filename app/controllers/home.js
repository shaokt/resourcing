import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    counterCSS: '',
    minLeft: 0, // the minimum left position to show names when scrolling

    settings: storageFor("settings"),
    showAssignment: function(){
        var self = this;
        if(this.get('constants.editingRow')){
            this.set('viewAssignment',[]);
            this.get('model.assignment').forEach(function(item){
                if(item.id === self.get('settings.assignmentTile')) self.viewAssignment.push(item);
            })

            this.set('numAssignmentsViewing', this.get('viewAssignment').length * 40); // 40=height of each assignment row
            return this.get('settings.isWeeklyCalendar') && this.get('settings.assignmentTile') !== "empty";
        }
        else {
            this.set('viewAssignment',[]);
            this.get('model.assignment').forEach(function(item){
                if($.inArray(item.id, self.get('constants.assArray')) !== -1){
                    self.viewAssignment.push(item);
                }
            })

            this.set('numAssignmentsViewing', this.get('viewAssignment').length * 40); // 40=height of each assignment row

            return this.get('settings.isWeeklyCalendar') && this.get('viewAssignment').length > 0;
        }

    }.property('settings.isWeeklyCalendar', 'settings.assignmentTile', 'constants.editingRow', 'constants.assArray'),

    init() {
        this._super();

        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();

        document.title += this.get('settings.view') == "timeaway" ? " - Time Off" : " - Assignments";

        //TODO: dynamic year
        this.year=2016
        var self = this;
        var vacationCounters = ['lieu', 'personal', 'sick', 'unofficial', 'vacation'];
        var vacationCountersPrevious = ['vacationCarryover'];
        $.each(vacationCounters, function(i, val){
        	self.counterCSS += '.tiles .' + val + '[data-year="' + self.year+ '"] { counter-increment:' + val + 'Counter } ';
        });
        $.each(vacationCountersPrevious, function(i, val){
        	self.counterCSS += '.tiles .' + val + '[data-year="' + (self.year-1) + '"] { counter-increment:' + val + 'Counter } ';
        });
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
              timeaway: "",
            });

            var store = this.get('model').resource
            newEmployee.save().then(function(){
                store.pushObject(newEmployee._internalModel)
            })
        }
    }
});
