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
        try{ this.active.removeClass('active'); }
        catch(e){ console.log(e.message)}
    },

    // make clicked obj the active tile
    actions: {
        select() {
            this.unselect();
            this.active = $(event.target);
            this.active.addClass('active');
        }
    }
});
