import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('assignment')
    },

    afterModel: function(){
        document.title += " - Edit Assignments"
    }
});
