import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    needs:['index'],

    didRender(){
        this._super(...arguments);
        var self = this;

        console.log(this.get('index'))
        var exists = $.getJSON('http://localhost:3000/file/' + this.get('direct.ad'), function() {})
        .done(function() {
            self.set('resource.hasDirects', exists.responseJSON ? true : false);
        })
    },

    // show/hide direct reports
    toggleDirects() {
        if(this.collapse === ''){
            this.set('direct.directs', this.get('store').query('direct', {manager: this.get('direct.ad')}));
            this.set('collapse', 'collapse')
        }
        else{
            this.set('direct.directs', null);
            this.set('collapse', '')
        }
    }
});
