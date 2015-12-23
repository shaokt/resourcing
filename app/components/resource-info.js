import Ember from 'ember';
import ResourceRowComponent from "./resource-row";

//export default Ember.Component.extend(ResourceRowComponent, {
export default ResourceRowComponent.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,

    actions: {
        editing() {
            this.toggleProperty('editing');
            this.set("resource.active", this.editing);
            if(this.editing == true){
                this.edit();
                $('body').attr('data-editing', true)
            }
            else {
                this.save();
                $('body').attr('data-editing', false)
            }
        },

        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? this.send('editName') : 0
        },

        editName() {
            this.sendAction('updateName', this.get('resource'));
            this.send('editing')
       }
    }
});
