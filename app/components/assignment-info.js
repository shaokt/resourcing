import Ember from 'ember';
import ResourceInfoComponent from "./resource-info";

export default ResourceInfoComponent.extend({
    persons: 0, // any person who is working on the project

    getPeople(org) {
        var self = this;
        org.forEach(function(person){
            var exists = $.getJSON('http://localhost:3000/file/' + person.get('ad'), function() {})
            .done(function() {
                var ad = person.get('ad');
                if(exists.responseJSON) {
                    self.set('persons.' + ad, self.get('store').query('direct', {manager: ad})).then(function(){
                        console.log(ad);
                        self.getPeople(self.get('persons.' + ad));
                    });
                }
                else{
                    console.log(ad);
                }
            })
        });
    },

    actions: {
        viewVacation() {
            var self = this;
            // var exists = $.getJSON('http://localhost:3000/file/PL145', function() {})
            // .done(function() {
            //     console.log(exists.responseJSON);
            // })

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
