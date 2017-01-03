import ApplicationAdapter from './application';
import { storageFor } from 'ember-local-storage';

export default ApplicationAdapter.extend({
    settings: storageFor("settings"),

    updateRecord(store, type, snapshot){
        var data = {};
        var serializer = store.serializerFor(type.modelName);
        serializer.serializeIntoHash(data, type, snapshot);
        serializer.serializeIntoHash(data, type, snapshot, { includeId: true })
        const url = `${this.host}/resources/${snapshot.id}/${this.get('constants.year')}/${this.get('settings.lastManager')}`;
        return this.ajax(url, "patch", {data: data});
    }
});
