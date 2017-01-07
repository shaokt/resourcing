import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
    settings: storageFor("settings"),

    beforeModel: function(transition){
        transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
        this.set('year', transition.queryParams.year);
    },

    model() {
        return this.get('store').query('assignment', {year:this.get('year')});
    }
});
