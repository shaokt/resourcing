import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('assignment')
    },

    ssetupController(controller, model) {
        this._super(controller, model);
    },
});
