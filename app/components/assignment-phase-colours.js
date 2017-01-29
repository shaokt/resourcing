import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    actions: {
        // add tagging colour on the phase
        updateColour() {
            const colour = Ember.$(event.target).attr('data-colour');
            this.set('assignment.stampCustomize.colour', colour);
            Ember.$(this.get('assignment.stampCustomize')[0]).attr('data-colour', colour);
            return false;
        },

        // remove tagging colour on the phase
        resetColour() {
            this.set('assignment.stampCustomize.colour', '');
            Ember.$(this.get('assignment.stampCustomize')[0]).removeAttr('data-colour');
            Ember.$('#doneCustomize').focus();
        }
    }
});
