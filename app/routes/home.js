import Ember from 'ember';

export default Ember.Route.extend({
    id: null,

    beforeModel: function(transition){
        this.id = transition.queryParams.id
    },

    model() {
        return Ember.RSVP.hash({
            //resource: this.get('store').findAll('resource'),
            resource: this.get('store').query('user', {manager: this.id}),
            assignment: this.get('store').findAll('assignment')
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
