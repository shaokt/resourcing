import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    })
});
