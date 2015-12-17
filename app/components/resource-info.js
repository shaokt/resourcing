import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,
    actions: {
        editing() {
            this.toggleProperty('editing');
            this.set("resource.active",this.editing);
        },

        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? this.send('editName') : 0
        },

        editName() {
            this.sendAction('updateName', this.get('resource'));
            this.set('editing', false);
            this.set("resource.active", false);
       },

        submitTodo(newTitle) {
            if (newTitle) {
                this.sendAction('action', newTitle);
            }
            this.set('newTitle', '');
        }
    }
});
