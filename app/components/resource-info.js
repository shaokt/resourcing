import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    editing: false,
    actions: {
        editing() {
            this.toggleProperty('editing');
        },

        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? event.preventDefault() : 0
        },

        submitName() {
           this.set('editing', false);
            /*
           let todo = this.get('todo');
           if (todo.get('title') === "") {
               this.sendAction('deleteTodo', todo);
           } else {
               this.sendAction('updateTodo', this.get('todo'));
           }
           this.set('editing', false);
           */
        }
    }
});
