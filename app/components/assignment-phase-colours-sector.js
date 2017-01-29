//import Ember from 'ember';
import AssignmentPhaseColoursComponent from "./assignment-phase-colours";

export default AssignmentPhaseColoursComponent.extend({
    tagName:'',
    selected: function(){
        return this.get('colour') === Ember.$(this.get('assignment.stampCustomize')).attr('data-colour');
    }.property('assignment.stampCustomize.colour')
});
