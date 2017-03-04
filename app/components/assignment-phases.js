import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'ul',
    childTag: Ember.computed('tagName', function(){
        if(this.get('tagName') === ''){ return 'option'; }
        else { return 'li'; }
    }),
    classNames: ['phases'],
    hasPhases: Ember.computed('assignment.phases', function(){
        return this.get('assignment.phases') && this.get('assignment.phases').string !== "";
    })
});
