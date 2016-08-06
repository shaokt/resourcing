import Ember from 'ember';
import KeyDownMixin from "../mixins/keydown";

export default Ember.Component.extend(KeyDownMixin, {
    tagName: 'li',
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),
    breakLink:false, // if true, do not move the phase in sync
    nonResizable: Ember.computed('stampPhase', 'shiftPhase', function(){ // determine when the assignment block is not resizeable
        return this.stampPhase || this.shiftPhase;
    }),

    /* move the phases around when active
     * @event   the event
     * @fromBinding     checks if this is being trigged from the keydown mixin
     */
    keyDown: function(event, fromBinding) {
        // do not allow scrolling when pressing arrow keys
        if(fromBinding && !event.target.type && [32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
            if(this.get('phaseToShift')){
                var x = parseInt($(this.get('phaseToShift')).attr('data-x')) + this.get('rowComponent.shiftHorizontal');
                var y = parseInt($(this.get('phaseToShift')).attr('data-y')) + this.get('rowComponent.shiftVertical');

    			switch (event.keyCode){
                    case 37: { // left
                        if(x > 0){
                            this.set('rowComponent.shiftHorizontal', this.get('rowComponent.shiftHorizontal') - this.constants.DIM);
                            //$(ph).attr('data-x', x -= this.constants.DIM);
                        }
                        break;
                    }
                    case 38: { // up
                        if(y > 0){
                            this.set('rowComponent.shiftVertical', this.get('rowComponent.shiftVertical') - this.constants.DIM);
                            //$(ph).attr('data-y', y -= this.constants.DIM);
                        }
                        break;
                    }
                    case 39: { // right
                        if(x < this.constants.calWidth - this.constants.DIM){
                            this.set('rowComponent.shiftHorizontal', this.get('rowComponent.shiftHorizontal') + this.constants.DIM);
                            //$(ph).attr('data-x', x += this.constants.DIM);
                        }
                        break;
                    }
                    case 40: { // down
                        if(y < this.constants.DIM*3){
                            this.set('rowComponent.shiftVertical', this.get('rowComponent.shiftVertical') + this.constants.DIM);
                            //$(ph).attr('data-y', y += this.constants.DIM);
                        }
                        break;
                    }
                }// switch
            }// if length
        }// if arrow keys
    },// keyDown

    // update the edited phases so they are in the store upon save
    updatePhases: function(){
        this.set('shiftPhase', false);

        try{
            $(this.get('phaseToShift'))
                .removeClass('active')
                .parent().find('[data-phaselink]').filter(function(){
                    $(this).removeAttr('data-phaselink');
                })

            var editedPhases = ($(this.get('row')).find('.phases')[0].innerHTML.replace(/<!---->/g, '')).htmlSafe()
            this.set('assignment.phases', editedPhases);
        }catch(e){} // no action taken, nothing to update
    },

    actions: {
        // assigns the phase of the project to stamp on the tile
        setStamp() {
            this.set('assignment.stampPhase', this.get('label'))
            this.set('current', event.target);
            this.set('stampPhase', true);
            this.unbindKeyDown();
            this.updatePhases(); // need to update in case of switching out of the shift radio option
        },

        // user wants to shift phases around
        shift() {
            if(this.get('shiftPhase')) return; // prevents bindKeyDown multiple times
            this.set('shiftPhase', true);
            this.set('current', event.target);
            this.set('rowComponent.breakLink', this.breakLink);
            this.bindKeyDown();
        },

        // done shifting, reset stamps to nothing
        shiftDone() {
            $(this.get('current')).prop('checked', false);
            this.set('assignment.stampPhase', null);
            this.set('stampPhase', false);
            this.unbindKeyDown();
            this.get('rowComponent').updateRelatedPhasesPosition();
            this.updatePhases();
        },

        // toggle between linking the phases together vs separate while moving them around
        togglePhaseLink(){
            this.set('rowComponent.breakLink', this.toggleProperty('breakLink'));
            this.get('rowComponent').getRelatedPhases();
        },
    }// actions
});
