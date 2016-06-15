import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    /*
    * in resource view, the model is the assignment
    * in assignment view, it is already the model
    */
    init: function(){
        this._super();
        if(this.get('model.assignment')){
            this.set('model', this.get('model.assignment'))
        }
    },

    isEmpty: function(){
        return this.get('settings.assignmentTile') == "empty"
    }.property('settings.assignmentTile'),

    // remove active state on selected item if it exists
    unselect: function(){
        if(!this.active){
            this.active = $('.tileOptions [data-active="true"]'); // this only occurs on load of default tile
        }
        try{ this.active.attr('data-active', false); }
        catch(e){}
    },

    actions: {
        select() {
            this.unselect();
            this.active = $(event.target);
            this.active.attr('data-active', true);
            this.set('settings.assignmentTile', this.active.attr('data-assignment'));
            this.constants.webcel.setTile(this.active);
        }
    }
});
