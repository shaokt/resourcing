import Ember from 'ember';
import ResourceInfoComponent from "./resource-info";
import { storageFor } from 'ember-local-storage';

export default ResourceInfoComponent.extend({
    counter: 0,
    peopleAssigned: 0,  // if there are people assigned to the assignment from the specified date
    findPeople: {},
    settings: storageFor("settings"),
    shiftPhase: function(){
        return this.get('phaseAction') == 'shift';
    }.property('phaseAction'),

    getPeople(org) {
        var self = this;
        org.forEach(function(person){
            ++self.counter;
            var exists = $.getJSON('http://localhost:3000/file/' + person.get('ad'), function() {})
            .done(function() {
                var ad = person.get('ad');
                if(exists.responseJSON) { // has direct reports
                    self.set('findPeople.' + ad, self.get('store').query('direct', {manager: ad})).then(function(){
                        --self.counter;
                        self.getPeople(self.get('findPeople.' + ad));
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
            this.set('constants.dataView', 'timeaway')
            this.set('constants.teamAsOfEmpty', false);
        }
        else {
            this.set('constants.teamAsOfEmpty', true);
        }
        this.set('peopleAssigned', 0);
    },

    // checks if the person has a specific assignment from a specific date
    hasAssignment(person) {
        var self = this;
        var assignment = $('<div></div>')
            .append(person.get('assignment'))
            .find('[data-assignment="' + this.currentAssignment + '"]')
            .filter(function(){
                return parseInt($(this).attr('data-x')) >= parseInt(self.get('constants.teamAsOf'));
            })

        if(assignment.length){
            this.set('peopleAssigned', ++this.peopleAssigned);
            this.get('persons').pushObject(person);
        }
    },

    actions: {
        // get vacation of those who are on the project
        viewTeam() {
            this.set('persons', []);
            this.set('constants.teamAsOfEmpty', false);
            if(this.get('settings.view') === 'timeaway') {
                this.set('readonly', false);
                this.set('settings.view', 'assignment')
                this.set('constants.dataView', 'assignment')
                this.set('constants.teamAssignment', '');
            }
            else {
                var self = this;
                this.set('readonly', true);
                this.set('currentAssignment', this.get('assignment.id'));
                this.set('constants.teamAssignment', this.get('assignment'));
                this.set('findPeople', this.get('store').query('direct', {manager: 'PL145'})).then(function(){
                    self.getPeople(self.findPeople);
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
