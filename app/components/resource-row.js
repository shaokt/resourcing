import Ember from 'ember';
import Webcel from "../mixins/webcel";

const{
    inject
}=Ember;
const { service }=inject;

export default Ember.Component.extend(Webcel, {
    dragSource: null,
    store: service(),
    shiftHorizontal: 0, // how many pixels left or right to move the related phases during shifting
    shiftVertical: 0, // how many pixels up or down to move the related phases during shifting

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
        this.set('row', this.$().parent().find('.row')[0]);
        this.set('rowComponent', this);

        this.constants.webcel.setup({
            row: this.get('row'), // the row being edited
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

    getPhase: function(x, y){
        var phaseToShift = $(this.row).find('.phases [data-x="' + x +'"][data-y="' + y + '"]')
        if(phaseToShift[0] === this.get('phaseToShift')) return; // do nothing if clicking the same phase to move around

        if(phaseToShift.length){
            this.updateRelatedPhasesPosition(); // choosing another phase, udpate all related phase positions first
            try {
                $(this.get('phaseToShift'))
                    .removeAttr('class')
                    .removeAttr('data-phaselink')
            }
            catch(e){} // nothing was initially set, do nothing
    		this.set('phaseToShift', phaseToShift[0]);

            $(phaseToShift)
                .addClass('active')
                .attr('data-phaselink', true);

            this.getRelatedPhases();
        }
    },

    getRelatedPhases: function(){
        // link all phases together if they are to the right of current phase
        if(!this.breakLink){
            this.resetPhaseToShiftPosition();
            var x = parseInt($(this.get('phaseToShift')).attr('data-x'));
            var links = $(this.get('phaseToShift')).parent().find('[data-x]').filter(function(){
                if(parseInt($(this).attr('data-x')) > x){
                    $(this).attr('data-phaselink', true)
                    return true;
                }
            })
        }
        else { // remove the links & update their new positions
            this.updateRelatedPhasesPosition();
        }
    },

    // update the x positions of the related phases being moved
    updateRelatedPhasesPosition: function(){
        var self = this;
        var links = $(this.get('phaseToShift')).parent().find('[data-phaselink]').filter(function(){
            if(this != self.get('phaseToShift')){
                $(this).removeAttr('data-phaselink')
                var x = parseInt($(this).attr('data-x'));
                $(this).attr('data-x', x + self.get('shiftHorizontal'));
            }
            return true;
        })
        this.resetPhaseToShiftPosition();
    },

    // when breaking and unbreaking the link, reset the phase being shift's position for proper calculations
    resetPhaseToShiftPosition: function(){
        var pts = $(this.get('phaseToShift'));
        pts.attr('data-x', parseInt(pts.attr('data-x')) + this.get('shiftHorizontal'));
        pts.attr('data-y', parseInt(pts.attr('data-y')) + this.get('shiftVertical'));
        this.set('shiftHorizontal', 0);
        this.set('shiftVertical', 0);
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
