import Ember from 'ember';
import Webcel from "../mixins/webcel";

const{
    inject
}=Ember;
const { service }=inject;

export default Ember.Component.extend(Webcel, {
    dragSource: null,
    store: service(),

    // row available for editing/painting
    edit: function(){
        // if a tile wasn't chosen, register the default loaded tile for painting
        if(this.get('router.currentRouteName') === 'home' && !this.constants.webcel.currentTile){
            try{
                $('.tileOptions [data-active="true"]')[0].click();
            }catch(e){
                $('.tileOptions a')[0].click();
            }
        }

        this.constants.webcel.setup({
            row: this.$().parent().find('.row')[0], // the row being edited
            data: this.get('resource'), // the data in store
            rowComponent: this
        });
    },

    save: function(){
        this.constants.save(this.get('resource'))
        this.constants.webcel.done();
    },

    isbefore:function (a, b){
    	if (a.parentNode == b.parentNode) {
    		for (var cur = a; cur; cur = cur.previousSibling) {
    			if (cur === b) { return true; }
    		}
    	}
    	return false;
    },

    actions:{
        dragEnter(e) {
            try{
            	var drop = $(e.target).parents('section')[0];
            	if(drop != this.dragSource && drop != undefined){
                    if(this.dragSource.ghost){
                        this.dragSource.ghost.remove();
                    }
                    else{
                        this.dragSource.ghost = document.createElement("section");
                        $(this.dragSource.ghost).addClass('resourceRow ghost')
                        $(this.dragSource.ghost).html(this.dragSource.innerHTML)
                    }

                    var isBefore = this.isbefore(this.dragSource, drop);
            		drop.parentNode.insertBefore(this.dragSource.ghost, isBefore ? drop : drop.nextSibling)
                    this.dragSource.newIndex = $(drop).attr('data-index')
                }
                else if(drop == this.dragSource) {
                    this.dragSource.newIndex = this.dragSource.index
                    this.dragSource.ghost.remove()
                }
            }
            catch(e){}
        },

        dragStart(e) {
        	this.dragSource = e.target;
            var item = this.get('model').resource.findBy('id', $(this.dragSource).attr('data-id'));
            this.dragSource.index = this.dragSource.newIndex = this.get('model').resource.indexOf(item);

        	$(this.dragSource).addClass('moving');
            $('#pageContainer').addClass('moving');
        	e.dataTransfer.effectAllowed = 'copyMove';
        },

        dragEnd() {
            console.log(this.dragSource.index + " : " + this.dragSource.newIndex)
        	$(this.dragSource).removeClass('moving');
            $(this.dragSource.ghost).remove()
            $('#pageContainer').removeClass('moving');

            var items = this.get('model').resource;
            var item = this.get('model').resource.objectAt(this.dragSource.index);

            items.removeAt(this.dragSource.index);
            try{
                items.insertAt(this.dragSource.newIndex, item._internalModel)
            }
            catch(e){ console.log(e.message)}
        },

        dragOver(e) {
            e.preventDefault();
        }
    }
});
