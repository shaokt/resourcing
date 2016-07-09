import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),

    actions: {
        // assigns the phase of the project to stamp on the tile
        setStamp() {
            this.set('shiftPhase', false);
            this.set('editType', 'stamp');
            this.set('assignment.stampPhase', this.get('label'))
        },

        shift() {
            this.set('shiftPhase', true);
        }
    }
});
