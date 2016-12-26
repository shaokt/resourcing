import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
    settings: storageFor("settings"),

    model() {
        return this.get('store').query('assignment', {year:this.get('settings.year')});
    }
});
