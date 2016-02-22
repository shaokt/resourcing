import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
    host: 'http://localhost:3000', //,
    //namespace: 'v1'
    /*
    updateRecord: function(store, type, snapshot) {
        //console.log(this.store.findAll('resource'))
        console.log(snapshot._attributes.name)
        return true
    }
    */
});
