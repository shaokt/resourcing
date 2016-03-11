import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            resource: this.get('store').findAll('resource'),
            assignment: this.get('store').findAll('assignment')
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
