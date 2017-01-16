import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    maxRows:10,
    showAdd: function(){
        return !this.get('assignment.rows') || this.get('assignment.rows') < this.maxRows;
    }.property('assignment.rows'),

    showMinus: function(){
        return this.get('assignment.rows') || this.get('assignment.rows') > 0;
    }.property('assignment.rows'),

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
                this.set('assignment.rows', --numRows);
            }
        }
    }
});
