import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',

    actions: {
        select() {
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
