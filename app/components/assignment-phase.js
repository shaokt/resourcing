import Ember from 'ember';
import KeyDownMixin from "../mixins/keydown";

export default Ember.Component.extend(KeyDownMixin, {
    tagName: 'li',
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),
    breakLink:false, // if true, do not move the phase in sync
    showHandles: Ember.computed('phaseAction', function(){
        return this.get('phaseAction') === '';
    }),
    shiftPhase: function(){
        return this.get('phaseAction') === 'shift';
    }.property('phaseAction'),

    maxDown: function(){ // maximum a phase can be shifted down
        return this.constants.DIM*3 + (this.get('assignment.rows') > 0 ? (this.get('assignment.rows') * this.constants.DIM) : 0);
    },

    /* move the phases around when active
     * @event   the event
     * @fromBinding     checks if this is being trigged from the keydown mixin
     */
    keyDown: function(event, fromBinding) {
        // do not allow scrolling when pressing arrow keys
        if(fromBinding && !event.target.type && [32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
            if(this.get('phaseToShift')){
                var x = parseInt(Ember.$(this.get('phaseToShift')).attr('data-x')) + this.get('rowComponent.shiftHorizontal');
                var y = parseInt(Ember.$(this.get('phaseToShift')).attr('data-y'));

    			switch (event.keyCode){
                    case 37: { // left
                        if(x > 0){
                            this.set('rowComponent.shiftHorizontal', this.get('rowComponent.shiftHorizontal') - this.constants.DIM);
                        }
                        break;
                    }
                    case 38: { // up
                        if(y > 0){
                            Ember.$(this.get('phaseToShift')).attr('data-y', y - this.constants.DIM);
                        }
                        break;
                    }
                    case 39: { // right
                        if(x < this.constants.calWidth - this.constants.DIM){
                            this.set('rowComponent.shiftHorizontal', this.get('rowComponent.shiftHorizontal') + this.constants.DIM);
                        }
                        break;
                    }
                    case 40: { // down
                        if(y < this.maxDown()){
                            Ember.$(this.get('phaseToShift')).attr('data-y', y + this.constants.DIM);
                        }
                        break;
                    }
                }// switch
            }// if length
        }// if arrow keys
    },// keyDown

    // update the edited phases so they are in the store upon save
    updatePhases: function(){
        try{
            Ember.$(this.get('phaseToShift'))
                .removeClass('active')
                .parent().find('[data-phaselink]').filter(function(){
                    Ember.$(this).removeAttr('data-phaselink');
                });

            var editedPhases = (Ember.$(this.get('row')).find('.phases')[0].innerHTML.replace(/<!---->/g, '')).htmlSafe();
            this.set('assignment.phases', editedPhases);
        }catch(e){} // no action taken, nothing to update
    },

    actions: {
        // readies the row for stamping phases onto the project
        setStamp() {
            this.send('donePhaseAction');
            this.set('assignment.stampPhase', this.get('label')); // the label to stamp onto the project
            this.set('current', event.target);
            this.set('phaseAction', "stamp");
        },

        // readies the row for deleting individual phases
        delete(){
            this.send('donePhaseAction');
            this.set('current', event.target);
            this.set('phaseAction', "delete");
        },

        // readies the row for shifting phases around
        shift() {
            if(this.get('phaseAction') === 'shift'){ return; } // prevents bindKeyDown multiple times
            this.set('phaseAction', "shift");
            this.set('current', event.target);
            this.set('rowComponent.breakLink', this.breakLink);
            this.bindKeyDown();
        },

        // toggle between linking the phases together vs separate while moving them around
        togglePhaseLink(){
            this.set('rowComponent.breakLink', this.toggleProperty('breakLink'));
            this.get('rowComponent').getRelatedPhases();
        },

        // done current action, reset states
        donePhaseAction(endAll) {
            Ember.$(this.get('current')).prop('checked', false);
            this.get('rowComponent').updateRelatedPhasesPosition();
            this.updatePhases();
            this.unbindKeyDown();
            this.set('phaseToShift', null);
            this.set('assignment.stampPhase', null);
            if(endAll){ this.set('phaseAction', ""); }
        }
    }// actions
});
