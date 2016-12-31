import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'tbody',
    classNameBindings: ['editing', 'isHidden:hidden'],
    attributeBindings: ['assignment.id:data-assignment-id'],
    editing: false,
    isHidden: Ember.computed.alias('assignment.hidden'),

    // background for assignment row based on hex value assigned
    hexbackground: Ember.computed('background', function() {
        var color = this.assignment.get('background');
        return new Ember.String.htmlSafe(color);
    }).property('assignment.background'),

    actions: {
        // if the current assignment is being edited
        editing() {
            this.toggleProperty('editing');
            if(this.editing === true){
                Ember.$('body').attr('data-editing', true);
            }
            else {
                Ember.$('body').attr('data-editing', false);
                this.constants.save(this.get('assignment'));
            }
        },

        // show/hide current assignment row
        toggleRow() {
            this.$().toggleClass('hidden');
            this.set('assignment.hidden', this.$().hasClass('hidden'));
            this.constants.save(this.get('assignment'));
        },

        // only allow 0-9, a-f, A-F for hex values
        filter(currentValue, event){
            const keyCode = event.which;
            if( !(keyCode >= 48 && keyCode <= 57) &&
                !(keyCode >= 65 && keyCode <= 70) &&
                !(keyCode >= 97 && keyCode <= 102)){
                event.preventDefault();
            }
        },

        // capitalize hex values
        upperCase(currentValue){
            currentValue.set('value', currentValue.get('value').toUpperCase());
        }
    }
});
