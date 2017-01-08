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
        else if(this.get('router.currentRouteName') === 'roadmap.index') {
            //if empty, place a block 3 columns wide centering on today's marker
            if(!this.get('assignment.w')){
                var col = this.constants.todayColumn;
                col -= col > 0 ? this.constants.DIM : 0;

                var width = this.constants.DIM * (this.constants.todayColumn === this.constants.calWidth - this.constants.DIM ? 2 : 3);

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
        this.constants.save(this.get('resource'));
        this.constants.webcel.done();
    },

    isbefore:function (a, b){
    	if (a.parentNode === b.parentNode) {
    		for (var cur = a; cur; cur = cur.previousSibling) {
    			if (cur === b) { return true; }
    		}
    	}
    	return false;
    },

    // get the phase clicked on for shifting
    getPhaseShift: function(x, y){
        var phaseToShift = Ember.$(this.row).find('.phases [data-x="' + x +'"][data-y="' + y + '"]');
        if(phaseToShift[0] === this.get('phaseToShift')){ return; } // do nothing if clicking the same phase to move around

        if(phaseToShift.length){
            this.updateRelatedPhasesPosition(); // choosing another phase, udpate all related phase positions first
            try {
                Ember.$(this.get('phaseToShift'))
                    .removeAttr('class')
                    .removeAttr('data-phaselink');
            }
            catch(e){} // nothing was initially set, do nothing
    		this.set('phaseToShift', phaseToShift[0]);

            Ember.$(phaseToShift)
                .addClass('active')
                .attr('data-phaselink', true);

            this.getRelatedPhases();
        }
    },

    getRelatedPhases: function(){
        // link all phases together if they are to the right of current phase
        if(!this.breakLink){
            this.resetPhaseToShiftPosition();
            var x = parseInt(Ember.$(this.get('phaseToShift')).attr('data-x'));
            Ember.$(this.get('phaseToShift')).parent().find('[data-x]').filter(function(){
                if(parseInt(Ember.$(this).attr('data-x')) > x){
                    Ember.$(this).attr('data-phaselink', true);
                    return true;
                }
            });
        }
        else { // remove the links & update their new positions
            this.updateRelatedPhasesPosition();
        }
    },

    // delete the phase as chosen by user
    getPhaseDelete: function(x, y){
        var clone = Ember.$(this.row).clone(); // clone needed for removing tiles if applicable
        var phaseToDelete = Ember.$(clone).find('.phases [data-x="' + x +'"][data-y="' + y + '"]');
        if(phaseToDelete.length){
            Ember.$(phaseToDelete[0]).remove();
    		var test = (Ember.$(clone).find(".phases")[0].innerHTML.replace(/<!---->/g, '').trim()).htmlSafe();
            this.set('assignment.phases', test);
        }
    },

    // update the x positions of the related phases being moved
    updateRelatedPhasesPosition: function(){
        var self = this;
        Ember.$(this.get('phaseToShift')).parent().find('[data-phaselink]').filter(function(){
            if(this !== self.get('phaseToShift')){
                Ember.$(this).removeAttr('data-phaselink');
                var x = parseInt(Ember.$(this).attr('data-x'));
                Ember.$(this).attr('data-x', x + self.get('shiftHorizontal'));
            }
            return true;
        });
        this.resetPhaseToShiftPosition();
    },

    // when breaking and unbreaking the link, reset the phase being shift's position for proper calculations
    resetPhaseToShiftPosition: function(){
        var pts = Ember.$(this.get('phaseToShift'));
        pts.attr('data-x', parseInt(pts.attr('data-x')) + this.get('shiftHorizontal'));
        pts.attr('data-y', parseInt(pts.attr('data-y')) + this.get('shiftVertical'));
        this.set('shiftHorizontal', 0);
        this.set('shiftVertical', 0);
    },

    // update the vacation/personal counters
    updateCounters(){
        var tiles = this.get('resource.timeaway');
        tiles = typeof(tiles) === 'object' ? tiles.string : tiles;
        var dataYear = `[data-year="${this.get('constants.year')}"]`;
        var div = Ember.$('<div></div>').append(tiles);

        var col = this.get('constants.todayColumn');
        var v1 = Ember.$(div).find(`.vacation${dataYear}`);
        var v2 = Ember.$(div).find(`.vacationHalf${dataYear}`);
        var v1TD = Ember.$(v1).filter(function(){ return parseInt(Ember.$(this).attr('data-x')) <= col; });
        var v2TD = Ember.$(v2).filter(function(){ return parseInt(Ember.$(this).attr('data-x')) <= col; });

        var p1 = Ember.$(div).find(`.personal${dataYear}`).length;
        var p2 = Ember.$(div).find(`.personalHalf${dataYear}`).length/2;
        this.set('resource.vacation', v1.length + v2.length/2);
        this.set('resource.vacationToDate', v1TD.length + v2TD.length/2);
        this.set('resource.personal', p1+p2);
    },

    actions:{
        findAssignment() {
            var x = this.get('constants').getMousePos(event);
    		var y = event.pageY  - Ember.$(event.target).offset().top;
            y = y - y%8; // 8 = height of tile of painted assignment

            var assignment = Ember.$(event.target).find('.tiles [data-x="' + x +'"][data-y="' + y*1.875 + '"]').attr('data-assignment');
            Ember.$('header .tileOptions .assignments').find('[data-assignment="' + assignment + '"]').click();
        },

        dragEnter(e) {
            try{
            	var drop = Ember.$(e.target).parents('section')[0];
            	if(drop !== this.dragSource && drop !== undefined){
                    if(this.dragSource.ghost){
                        this.dragSource.ghost.remove();
                    }
                    else{
                        this.dragSource.ghost = document.createElement("section");
                        Ember.$(this.dragSource.ghost).addClass('resourceRow ghost');
                        Ember.$(this.dragSource.ghost).html(this.dragSource.innerHTML);
                    }

                    var isBefore = this.isbefore(this.dragSource, drop);
            		drop.parentNode.insertBefore(this.dragSource.ghost, isBefore ? drop : drop.nextSibling);
                    this.dragSource.newIndex = Ember.$(drop).attr('data-index');
                }
                else if(drop === this.dragSource) {
                    this.dragSource.newIndex = this.dragSource.index;
                    this.dragSource.ghost.remove();
                }
            }
            catch(error){}
        },

        dragStart(e) {
            this.set('theModel', 'model' + (this.get('router.currentRouteName') === 'home' ? '.resource' : ''));

        	this.dragSource = e.target;
            var item = this.get(this.get('theModel')).findBy('id', Ember.$(this.dragSource).attr('data-id'));
            this.dragSource.index = this.dragSource.newIndex = this.get(this.get('theModel')).indexOf(item);

        	Ember.$(this.dragSource).addClass('moving');
            Ember.$('#pageContainer').addClass('moving');
        	e.dataTransfer.effectAllowed = 'copyMove';
            e.dataTransfer.setDragImage(Ember.$('<div></div>')[0], 0, 0);
        },

        dragEnd() {
        	Ember.$(this.dragSource).removeClass('moving');
            Ember.$(this.dragSource.ghost).remove();
            Ember.$('#pageContainer').removeClass('moving');

            var items = this.get(this.get('theModel'));
            var item = this.get(this.get('theModel')).objectAt(this.dragSource.index);

            items.removeAt(this.dragSource.index);
            if(this.get('theModel') === 'model.resource'){
                this.get('store').adapterFor('resource').swap(this.dragSource);
            } else {
                this.get('store').adapterFor('assignment').swap(this.dragSource);
            }
            try{
                items.insertAt(this.dragSource.newIndex, item._internalModel);
            }
            catch(error){}
        },

        dragOver(e) {
            e.preventDefault();
        }
    }
});
