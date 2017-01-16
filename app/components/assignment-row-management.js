import Ember from 'ember';
import AssignmentPhaseComponent from "./assignment-phase";

export default AssignmentPhaseComponent.extend({
    tagName:'div',
    classNames:['rowManagement'],
    id:'',
    maxRows:10,
    showAdd: function(){
        return !this.get('assignment.rows') || this.get('assignment.rows') < this.maxRows;
    }.property('assignment.rows'),

    showMinus: function(){
        return this.get('assignment.rows') || this.get('assignment.rows') > 0;
    }.property('assignment.rows'),

    movePhasesUp: function(num){
        const newRow = this.constants.DIM*3 + (num*this.constants.DIM);
        const self = this;
        Ember.$(this.get('row')).find(`.phases [data-type="tile"]`).each(function(){
            const y = parseInt(Ember.$(this).attr('data-y'));
            if(y === newRow){
                Ember.$(this).attr('data-y',y-self.constants.DIM);
            }
        });
    },

    actions: {
        rowAdd(){
            let numRows = this.get('assignment.rows') || 0;
            if(numRows < this.maxRows) {
                this.set('assignment.rows', ++numRows);
            }
        },

        rowMinus(){
            let numRows = this.get('assignment.rows') || 0;
            if(numRows > 0) {
                this.movePhasesUp(numRows);
                this.set('assignment.rows', --numRows);
            }
        }
    }
});
