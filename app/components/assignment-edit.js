import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'tbody',
    classNameBindings: ['editing'],
    attributeBindings: ['assignment.id:data-assignment-id'],
    editing: false,

    hexbackground: Ember.computed('background', function() {
        var color = this.assignment.get('background');
        return new Ember.String.htmlSafe(color);
        //Ember.String.htmlSafe
    }).property('assignment.background'),

    actions:{
        editing() {
            this.toggleProperty('editing');
            if(this.editing == true){
                //TODO:  hide other locks
            }
            else {
                this.constants.save(this.get('assignment'))
            }
        }
    }
});
