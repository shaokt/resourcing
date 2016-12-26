import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
    id: null,
    settings: storageFor("settings"),

    beforeModel: function(transition){
        this.id = transition.queryParams.id;
        this.set('settings.lastManager', this.id);
    },

    model() {
        return Ember.RSVP.hash({
            resource: this.get('store').query('user', {year: this.get('settings.year'), manager: this.id}),
            assignment: this.get('store').query('assignment', {year:this.get('settings.year')})
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
