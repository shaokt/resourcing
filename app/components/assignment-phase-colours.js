import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        updateColour() {
            const colour = Ember.$(event.target).attr('data-colour');
            if(colour === 'gry') {
                Ember.$(this.get('assignment.stampCustomize')[0]).removeAttr('data-colour');
            }
            else {
                Ember.$(this.get('assignment.stampCustomize')[0]).attr('data-colour', colour);
            }
        }
    }
});
