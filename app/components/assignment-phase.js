import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    currentRadio: null,
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),

    actions: {
        // assigns the phase of the project to stamp on the tile
        setStamp() {
            this.set('shiftPhase', false);
            this.set('assignment.stampPhase', this.get('label'))
            this.set('currentRadio', event.target);
        },

        // user wants to shift phases around
        shift() {
            this.set('shiftPhase', true);
            this.set('currentRadio', event.target);
        },

        // done shifting, reset stamps to nothing
        shiftDone() {
            $(this.get('currentRadio')).prop('checked', false);
            this.set('assignment.stampPhase', null);
            this.set('shiftPhase', false);
        }
    }
});
