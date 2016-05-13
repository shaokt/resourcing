import Ember from 'ember';

export default Ember.Route.extend({
    id: null,

    beforeModel: function(transition){
        this.id = transition.queryParams.id
        console.log(this.id);
    },

    model() {
        return Ember.RSVP.hash({
            resource: this.get('store').findAll('resource'),
            assignment: this.get('store').findAll('assignment')
            //resource: this.get('store').find('user', 'Kristin')
            //resource: this.get('store').findAll('user', {id:'Kristin'}),
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
