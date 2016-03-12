import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

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
        }
    }
});
