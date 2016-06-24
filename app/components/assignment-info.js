import Ember from 'ember';
import ResourceInfoComponent from "./resource-info";

export default ResourceInfoComponent.extend({
    persons: 0, // any person who is working on the project
    currentAssignment: 0,   // current assignment we want to view specifically
    column: 495,    // starting column to check against - remove hard coding later

    getPeople(org) {
        var self = this;
        org.forEach(function(person){
            var exists = $.getJSON('http://localhost:3000/file/' + person.get('ad'), function() {})
            .done(function() {
                var ad = person.get('ad');
                if(exists.responseJSON) {
                    self.set('persons.' + ad, self.get('store').query('direct', {manager: ad})).then(function(){
                        //console.log(ad);
                        self.hasAssignment(person);
                        self.getPeople(self.get('persons.' + ad));
                    });
                }
                else{
                    //console.log(ad);
                    self.hasAssignment(person);
                }
            })
        });
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
            console.log(person.get('ad'))
            console.log(assignment)
        }
    },

    actions: {
        // get vacation of those who are on the project
        viewVacation() {
            var self = this;
            this.set('currentAssignment', this.get('assignment.id'));
            this.set('persons', this.get('store').query('direct', {manager: 'PL145'})).then(function(){
                self.getPeople(self.persons);
            });
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
