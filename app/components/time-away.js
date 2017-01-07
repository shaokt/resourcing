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
            "vacationHalf",
            "sick",
            "personal",
        	"lieu",
        	"wfh",
            "personalHalf",
        	"conference",
        	"training",
        	"bereavement",
            "shortTermDisability",
            "parentalLeave",
        	"jury",
        	"firstDay",
        	"lastDay"
    ],

    // remove active state on selected item if it exists
    unselect: function(){
        if(!this.active){
            this.active = Ember.$('.tileOptions [data-active="true"]'); // this only occurs on load of default tile
        }
        try{ this.active.attr('data-active', false); }
        catch(e){}
    },

    // make clicked obj the active tile for painting
    // TODO: extend a tile component
    actions: {
        select() {
            this.unselect();
            this.active = Ember.$(event.target);
            if(this.active[0].tagName.match(/span/i)) { this.active = this.active.closest('a'); }
            this.active.attr('data-active', true);
            this.set('settings.timeawayTile', this.active[0].className);
            this.constants.webcel.setTile(this.active);
        }
    }
});
