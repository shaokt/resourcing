import Ember from 'ember';
import Webcel from "../mixins/webcel";

export default Ember.Component.extend(Webcel, {
//export default ResourceRowComponent.extend({
    webcel: 'webcel',
    isWeeklyCalendar: function(){
        return this.get('viewType') === 'assignment';
    }.property('viewType'),

    isDailyCalendar: function(){
        return this.get('viewType') === 'timeaway';
    }.property('viewType'),

    edit: function(){
        this.constants.webcel = this.Webcel(this.$());
    },

    save: function(){
        this.constants.webcel.done();
    }
});
