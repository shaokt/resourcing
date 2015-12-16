import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'header',

    isAssignment: function() {
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isTimeOff: function() {
        return this.get('viewType') === 'timeoff';
    }.property('viewType'),

    actions: {
        toggleView() {
            if(this.viewType == "assignment"){
                this.set("viewType","timeoff");
            }
            else{
                this.set("viewType","assignment");
            }
        }
    }
});
