import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    counterCSS: '',
    minLeft: 0, // the minimum left position to show names when scrolling

    settings: storageFor("settings"),
    showAssignment: Ember.computed('settings.assignmentTile', function(){
        var self = this;
        this.viewAssignment = [];
        this.get('model.assignment').forEach(function(item){
            if(item.id === self.get('settings.assignmentTile')) self.viewAssignment.push(item);
        })
        return this.get('settings.assignmentTile') !== "empty";
    }),

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
