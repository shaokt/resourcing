import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',
    classNameBindings: ['assignment'],
    actions: {
        toggleView() {
            this.toggleProperty('assignment');
        }
    }
});
