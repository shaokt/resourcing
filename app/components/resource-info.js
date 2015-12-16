import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,
    actions: {
        editing() {
            let resource = this.get('resource');
            this.toggleProperty('editing');
            this.set("resource.active",this.editing); 
            //this.set("active", this.editing);
        },

        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? this.send('submitName') : 0
        },

        submitName() {
           let resource = this.get('resource');
           this.sendAction('updateName', this.get('resource'));
           this.set('editing', false);
       },

        submitTodo(newTitle) {
            if (newTitle) {
                this.sendAction('action', newTitle);
            }
            this.set('newTitle', '');
        }
    }
});
