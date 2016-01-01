import Ember from 'ember';
import Webcel from "../mixins/webcel";

export default Ember.Component.extend(Webcel, {
    dragSource: null,

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

    isbefore:function (a, b){
    	if (a.parentNode == b.parentNode) {
    		for (var cur = a; cur; cur = cur.previousSibling) {
    			if (cur === b) { return true; }
    		}
    	}
        //$(b).attr('hover', false)
    	return false;
    },

    actions:{
        updateName(resource) {
            this.sendAction('updateName', resource);
        },

        dragEnter(e) {
            try{
            	var drop = $(e.target).parents('section')[0];
            	if(drop != this.dragSource){
            		drop.parentNode.insertBefore(this.dragSource, this.isbefore(this.dragSource, drop) ? drop : drop.nextSibling)
                }
            }catch(e){}
        },

        dragStart(e) {
        	this.dragSource = e.target;
        	$(this.dragSource).addClass('moving');
            $('#pageContainer').addClass('moving');
        	e.dataTransfer.effectAllowed = 'copyMove';
        	e.dataTransfer.setDragImage($(this.dragSource).find(".name")[0], -15, 15);
        },

        dragEnd() {
        	$(this.dragSource).removeClass('moving');
            $('#pageContainer').removeClass('moving');
        },

        dragOver(e) {
            e.preventDefault();
        }
    }
});
