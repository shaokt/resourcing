import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    active: null,

    // TODO: config through JSON for easy updates
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

    // remove active state on selected item if it exists
    unselect: function(){
        try{ this.active.attr('data-active', false); }
        catch(e){}
    },

    // make clicked obj the active tile
    actions: {
        select() {
            this.unselect();
            this.active = $(event.target);
            this.active.attr('data-active', true);
            this.constants.webcel.setTile(this.active);
        }
    }
});
