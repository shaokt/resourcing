import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['phases'],
    hasPhases: Ember.computed('assignment.phases', function(){
        return this.get('assignment.phases') && this.get('assignment.phases').string !== "";
    })
});
