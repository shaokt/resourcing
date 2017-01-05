import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Helper.extend({
    settings: storageFor("settings"),

    // params[0] - the current view
    // params[1] - the tile being loaded/compared to
    compute(params) {
        return this.get('settings').get(params[0] + 'Tile') === params[1];
    }
});
