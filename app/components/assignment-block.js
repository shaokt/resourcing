import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'div',
    classNames:['tiles'],
    widthCalc: Ember.computed('assignment.w', function() {
        return Ember.String.htmlSafe(this.get('assignment.w'));
    })
});
