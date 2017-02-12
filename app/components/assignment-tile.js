import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    actions: {
        // clear all checkboxes indicating which assignments to view
        clear() {
            this.get('model').forEach((item)=>{
                if(Ember.$.inArray(item.id, this.get('constants.assArray')) !== -1){
                    Ember.$(`#ass-${item.id}-v`).click();
                }
            });
            this.set('constants.assArray', []);
        }
    }
});
