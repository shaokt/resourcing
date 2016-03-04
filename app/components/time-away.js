import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    active: null,

    // TODO: JSON file for easy updates
    timeaway: [
            "empty",
            "vacation",
            "vacationCarryover",
            "vacationTentative",
            "sick",
            "personal",
        	"lieu",
        	"unofficial",
        	"wfh",
        	"conference",
        	"training",
        	"half",
        	"bereavement",
            "parentalLeave",
        	"jury",
        	"firstDay",
        	"lastDay"
    ],
    tester: function(){
        console.log(this.get('item'))
        return true
    }.property('item'),

    // remove active state on selected item if it exists
    unselect: function(){
        if(!this.active){
            this.active = $('.tileOptions [data-active="true"]'); // this only occurs on load of default tile
        }
        try{ this.active.attr('data-active', false); }
        catch(e){}
    },

    // make clicked obj the active tile for painting
    // TODO: extend a tile component
    actions: {
        select() {
            this.unselect();
            this.active = $(event.target);
            this.active.attr('data-active', true);
            this.set('settings.timeawayTile', this.active.context.className);
            this.constants.webcel.setTile(this.active);
        }
    }
});
