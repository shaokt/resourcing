import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    needs:['index'],

    //TODO: DELETE All of this
    _delete_didRender(){

        this._super(...arguments);
        var self = this;

        var exists = Ember.$.getJSON(`http://localhost:3000/exists/${this.get('constants.year')}/this.get('direct.ad')`, function() {})
        .done(function() {
            self.set('resource.hasDirects', exists.responseJSON ? true : false);
        });
    },

    // show/hide direct reports
    _delete_toggleDirects() {
        return;
        if(this.collapse === ''){
            this.set('direct.directs', this.get('store').query('direct', {manager: this.get('direct.ad')}));
            this.set('direct.expanded', true);
            this.set('collapse', 'collapse');
        }
        else{
            this.set('direct.directs', null);
            this.set('direct.expanded', false);
            this.set('collapse', '');
        }
    }
});
