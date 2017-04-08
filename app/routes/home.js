import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
    settings: storageFor("settings"),
    queryParams: {
        id: { refreshModel: true },
        year: { refreshModel: true }
    },

    beforeModel: function(transition){
        transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
        this.set('id', transition.queryParams.id);
        this.set('year', transition.queryParams.year);
        this.set('settings.lastManager', this.id);
    },

    model() {
        return Ember.RSVP.hash({
            resource: this.get('store').query('user', {year: this.get('year'), manager: this.get('id')}),
            assignment: this.get('store').query('assignment', {year:this.get('year')})
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
