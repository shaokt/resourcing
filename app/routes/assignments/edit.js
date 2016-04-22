import Ember from 'ember';

export default Ember.Route.extend({
    init:function(){
          this.set('constants.editAssignments', true);
    }.on('init')
});
