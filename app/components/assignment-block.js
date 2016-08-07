import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
    tagName:'div',
    classNames:['tiles'],
    settings: storageFor("settings"),
    widthCalc: Ember.computed('assignment.w', function() {
        return Ember.String.htmlSafe(this.get('assignment.w'));
    }),
    widthCalcTeamView: Ember.computed('assignment.w', function() {
        return Ember.String.htmlSafe(this.get('assignment.w') * 5);
    }),
    showHandles: Ember.computed('phaseAction', function(){
        return this.get('phaseAction') === '';
    })
});
