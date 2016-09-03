import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
    tagName:'',
    settings: storageFor("settings"),

    // remove active state on selected item if it exists
    unselect: function(){
        if(!this.active){
            this.active = $('.tileOptions [data-active="true"]'); // this only occurs on load of default tile
        }
        try{ this.active.attr('data-active', false); }
        catch(e){}
    },

    actions: {
        // dispatch for paint vs view depending on where component is rendered
        select() { this.send(this.get('paint') ? 'selectForPaint' : 'selectForView'); },

        selectForPaint() {
            this.unselect();
            this.active = $(event.target);
            this.active.attr('data-active', true);
            this.set('settings.assignmentTile', this.active.attr('data-assignment'));
            this.constants.webcel.setTile(this.active);
        },

        selectForView() {
            var self = this;
            var newList = this.get('constants.assArray');
            this.active = $(event.target);
            this.active = this.active[0].tagName.match(/input/i) ? this.active.prev() : this.active;

            if(this.active.attr('data-active') === 'true'){ // remove from list of projects to view
                this.set('item.selected', false);
                this.active.attr('data-active', false);
                this.set('constants.assArray',
                    newList.filter(function(i) {
                    	return i != self.active.attr('data-assignment');
                    })
                )
            }
            else { // add to list of projects to view
                this.set('item.selected', true);
                this.active.attr('data-active', true);
                newList.push(this.active.attr('data-assignment'));
                this.set('constants.assArray', Array.from(newList));
            }
        }// selectForView
    }// actions
});
