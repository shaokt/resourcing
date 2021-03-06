import ApplicationAdapter from './application';
import { storageFor } from 'ember-local-storage';

export default ApplicationAdapter.extend({
    settings: storageFor("settings"),

    createRecord(store, type, snapshot){
        return this._createRecord(store, type, snapshot, 'resources', this.get('settings.lastManager'));
    },

    updateRecord(store, type, snapshot){
        return this._updateRecord(store, type, snapshot, 'resources', this.get('settings.lastManager'));
    },

    swap(obj){
        return this._swap(obj, 'resources', this.get('settings.lastManager'));
    },

    deleteRecord(store, type, snapshot){
        return this._deleteRecord(store, type, snapshot, 'resources', this.get('settings.lastManager'));
    }
});
