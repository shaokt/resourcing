import Ember from 'ember';
import Webcel from "../mixins/webcel";

export default Ember.Component.extend(Webcel, {
//export default ResourceRowComponent.extend({
    webcel: 'webcel',
    isWeeklyCalendar: function(){
        return this.get('config.view') === 'assignment';
    }.property('config.view'),

    isDailyCalendar: function(){
        return this.get('config.view') === 'timeaway';
    }.property('config.view'),

    // row available for editing/painting
    edit: function(){
        // if a tile wasn't chosen, register the default loaded tile for painting
        if(!this.constants.webcel.currentTile){ $('.tileOptions [data-active="true"]')[0].click(); }

        this.constants.webcel.setup({
            row: this.$().parent().find('.row')[0], // the row being edited
            data: this.get('resource') // the data in store
        });
    },

    save: function(){
        this.constants.webcel.done();
    },
    
    actions:{
        updateName(resource) {
            this.sendAction('updateName', resource);
        }
    }
});
