import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    active: null,

    // TODO: JSON file for easy updates
    timeaway: [
            "vacation",
            "vacationCarryover",
            "vacationTentative",
        	"unofficial",
            "sick",
            "personal",
        	"lieu",
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
