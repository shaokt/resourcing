import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['phases'],
    actions: {
        togglePhaseLink(){
            this.sendAction('togglePhaseLink'); // resource-row component
        }
    }
});
