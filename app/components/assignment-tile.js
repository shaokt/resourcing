import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    omit:false, // do not render the tiles in the header if set to true

    /*
    * in resource view, the model is the assignment
    * in assignment view, it is already the model
    */
    init: function(){
        this._super();
        if(this.get('model.assignment')){
            this.set('model', this.get('model.assignment'));
        }
        else {  // do not render the tiles in the header...they will render on each assignment row
            this.set('omit', true);
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

});
