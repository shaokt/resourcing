import Ember from 'ember';
import Webcel from "../mixins/webcel";

const{
    inject
}=Ember;
const { service }=inject;

export default Ember.Component.extend(Webcel, {
    tagName:'',
    dragSource: null,
    store: service(),
    shiftHorizontal: 0, // how many pixels left or right to move the related phases during shifting
    shiftVertical: 0, // how many pixels up or down to move the related phases during shifting

    // row available for editing/painting
    edit: function(){
        this.set('row', this.$().parent().find('.row')[0]);
        this.set('rowComponent', this);

        if(this.get('router.currentRouteName') === 'home' && !this.constants.webcel.currentTile){
            var self = this;
            setTimeout(function(){
                try { //choose active tile for painting
                    self.$().find('.tileOptions a[data-active="true"]')[0].click();
                }
                catch(e){ //if none was chosen, use first tile
                    self.$().find('.tileOptions a')[0].click();
                }
            }, 0);
        }
        else if(this.get('router.currentRouteName') === 'assignments.index') {
            //if empty, place a block 3 columns wide centering on today's marker
            if(!this.get('assignment.w')){
                var col = this.constants.todayColumn;
                col -= col > 0 ? this.constants.DIM : 0;

                var width = this.constants.DIM * (this.constants.todayColumn == this.constants.calWidth - this.constants.DIM ? 2 : 3);

                this.set('assignment.w', width);
                this.set('assignment.x', col);
            }
            this.set('assignment.minWidth', this.constants.DIM * 3);
        }

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

    // get the phase clicked on for shifting
    getPhaseShift: function(x, y){
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

    // delete the phase as chosen by user
    getPhaseDelete: function(x, y){
        var clone = $(this.row).clone(); // clone needed for removing tiles if applicable
        var phaseToDelete = $(clone).find('.phases [data-x="' + x +'"][data-y="' + y + '"]')
        if(phaseToDelete.length){
            //var phaseContainer = $(phaseToDelete)[0].parentNode;
            $(phaseToDelete[0]).remove();
    		var test = ($(clone).find(".phases")[0].innerHTML.replace(/<!---->/g, '').trim()).htmlSafe();
            this.set('assignment.phases', test)
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
        findAssignment() {
            var x = this.get('constants').getMousePos(event);
    		var y = event.pageY  - $(event.target).offset().top;
            y = y - y%8; // 8 = height of tile of painted assignment

            var assignment = $(event.target).find('.tiles [data-x="' + x +'"][data-y="' + y*1.875 + '"]').attr('data-assignment');
            $('header .tileOptions .assignments').find('[data-assignment="' + assignment + '"]').click();
        },

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
