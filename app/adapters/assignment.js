import ApplicationAdapter from './application';
import { storageFor } from 'ember-local-storage';

export default ApplicationAdapter.extend({
    settings: storageFor("settings"),

    createRecord(store, type, snapshot){
        return this._createRecord(store, type, snapshot, 'assignments', 'assignment');
    },

    updateRecord(store, type, snapshot){
        return this._updateRecord(store, type, snapshot, 'assignments', 'assignment');
    },

    swap(obj){
        return this._swap(obj, 'assignments', 'assignment');
    }
});
