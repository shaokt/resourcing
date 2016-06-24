import Ember from 'ember';
import ResourceInfoComponent from "./resource-info";
import { storageFor } from 'ember-local-storage';

export default ResourceInfoComponent.extend({
    column: 495,    // starting column to check against - remove hard coding later
    counter: 0,
    currentAssignment: 0,   // current assignment we want to view specifically
    peopleAssigned: 0,  // if there are people assigned to the assignment from the specified date
    persons: 0, // any person who is working on the project
    settings: storageFor("settings"),

    getPeople(org) {
        var self = this;
        org.forEach(function(person){
            ++self.counter;
            var exists = $.getJSON('http://localhost:3000/file/' + person.get('ad'), function() {})
            .done(function() {
                var ad = person.get('ad');
                if(exists.responseJSON) { // has direct reports
                    self.set('persons.' + ad, self.get('store').query('direct', {manager: ad})).then(function(){
                        --self.counter;
                        self.getPeople(self.get('persons.' + ad));
                        self.hasAssignment(person);
                        if(self.counter===0){ self.done(); }
                    });
                }
                else { // no direct reports
                    setTimeout(function(){
                        --self.counter;
                        if(self.counter===0){ self.done(); }
                        self.hasAssignment(person);
                    }, 0)
                }
            })
        })
    },

    done() {
        if(this.peopleAssigned){
            this.set('settings.view', 'timeaway');
        }
        this.set('peopleAssigned', 0);
    },

    // checks if the person has a specific assignment from a specific date
    hasAssignment(person) {
        var assignment = $('<div></div>')
            .append(person.get('assignment'))
            .find('[data-assignment="' + this.currentAssignment + '"]')
            .filter(function(){
                return $(this).attr('data-x') >= 465
            })

        if(assignment.length){
            this.set('peopleAssigned', ++this.peopleAssigned);
        }
    },

    actions: {
        // get vacation of those who are on the project
        viewVacation() {
            if(this.get('settings.view') === 'timeaway') {
                this.set('settings.view', 'assignment')
            }
            else {
                var self = this;
                this.set('currentAssignment', this.get('assignment.id'));
                this.set('persons', this.get('store').query('direct', {manager: 'PL145'})).then(function(){
                    self.getPeople(self.persons);
                })
            }
        },

        select() {
            var obj;
            // if browser thinks the target is the span tag instead of the anchor, return the parent
            if($(event.target)[0].tagName.match(/span/gi)){ obj = $(event.target.parentNode); }
            else { obj = $(event.target) }
            this.set('assignment.paint', obj.hasClass('empty') ? false : true)
            this.constants.webcel.setTile(obj);
        }
    }
});
