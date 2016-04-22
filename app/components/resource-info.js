import Ember from 'ember';
import ResourceRowComponent from "./resource-row";

//export default Ember.Component.extend(ResourceRowComponent, {
export default ResourceRowComponent.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,

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
