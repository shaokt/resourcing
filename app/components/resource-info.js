import Ember from 'ember';
import ResourceRowComponent from "./resource-row";

//export default Ember.Component.extend(ResourceRowComponent, {
export default ResourceRowComponent.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,
    hasDirects: false,

    init(){
        this._super(...arguments);
        var self = this;

        // check if the current resource has a file of their own
        if (this.get('resource.name') === 'Kristin T') {
            var blah= $.getJSON( "http://localhost:3000/users?manager=Kristin", function(){})
            .done(function() {
                self.set('hasDirects', true);
            });
        }
    },

    actions: {
        // open a row up for edit by unlocking
        editing() {
            this.toggleProperty('editing');
            this.set("resource.active", this.editing);
            if(this.editing == true){
                this.edit();
                this.set('constants.editingRow', true);
            }
            else {
                this.set('constants.editingRow', false);
                this.save();
            }
        },

        toggleRow() {
            this.$().parent().toggleClass('hidden');
            this.set('resource.hidden', this.$().parent().hasClass('hidden'));
            this.constants.save(this.get('resource'))
        },

        // filter for contenteditable name field
        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? this.send('editName') : 0
        },

        // TODO:  send the name back up for saving
        editName() {
            this.send('editing')
       }
    }
});
