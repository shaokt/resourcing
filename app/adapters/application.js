import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
    host: 'http://localhost:3000',
    //namespace: 'v1'

    _updateRecord(store, type, snapshot, path, filename){
        const url = `${this.host}/${path}/${snapshot.id}/${this.get('constants.year')}/${filename}`;
        return this.ajax(url, "patch", {data: this.serializeData(store, type, snapshot)});
    },

    _createRecord(store, type, snapshot, path, filename){
        const url = `${this.host}/${path}/${snapshot.id}/${this.get('constants.year')}/${filename}`;
        return this.ajax(url, "post", {data: this.serializeData(store, type, snapshot)});
    },

    _swap(obj, path, filename){
        const url = `${this.host}/${path}/swap/${this.get('constants.year')}/${filename}/${obj.index}/${obj.newIndex}`;
        return this.ajax(url, "patch");
    },

    serializeData(store, type, snapshot){
        var data = {};
        var serializer = store.serializerFor(type.modelName);
        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
        return data;
    }
});
