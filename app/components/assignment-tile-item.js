import Ember from 'ember';
import AssignmentTileComponent from "./assignment-tile";
import { storageFor } from 'ember-local-storage';

export default AssignmentTileComponent.extend({
    tagName:'',
    settings: storageFor("settings"),
    selected: false,

    isActive: function(){
        return !this.get('paint') ? false : this.get('item.id') == this.get('settings.assignmentTile');
    }.property('settings.assignmentTile'),

    // set up tile for painting
    selectForPaint: function() {
        this.set('settings.assignmentTile', this.get('item.id'));
        this.constants.webcel.setTile($(event.target));
    },

    selectForView() {
        var self = this;
        var newList = this.get('constants.assArray');

        if(this.selected){ // remove from list of projects to view
            newList = newList.filter(function(i) { return i != self.get('item.id'); })
        }
        else { // add to list of projects to view
            newList.push(this.get('item.id'));
        }

        this.set('constants.assArray', Array.from(newList))
        this.toggleProperty('selected');
    },// selectForView

    actions: {
        // dispatch for paint vs view depending on where component is rendered
        select() {
            this.get('paint') ? this.selectForPaint() : this.selectForView();
        }
    }// actions
});
