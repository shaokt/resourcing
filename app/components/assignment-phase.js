import Ember from 'ember';
import KeyDownMixin from "../mixins/keydown";

export default Ember.Component.extend(KeyDownMixin, {
    tagName: 'li',
    currentRadio: null,
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),
    ox: null, // original x axis of the phase to shift
    oy: null, // original y axis of the phase to shift

    keyDown: function(event) {
        // do not allow scrolling when pressing arrow keys
        if(!event.target.type && [32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
            if(this.get('phaseToShift')){
                var ph = this.get('phaseToShift')[0];
                var x = parseInt($(ph).attr('data-x'));
                var y = parseInt($(ph).attr('data-y'));

                if(!this.ox){
                    this.ox = x;
                    this.oy = y;
                }

    			switch (event.keyCode){
                    case 37: { // left
                        if(x > 0){
                            $(ph).attr('data-x', x -= this.constants.DIM);
                        }
                        break;
                    }
                    case 38: { // up
                        if(y > 0){
                            $(ph).attr('data-y', y -= this.constants.DIM);
                        }
                        break;
                    }
                    case 39: { // right
                        if(x < this.constants.calWidth - this.constants.DIM){
                            $(ph).attr('data-x', x += this.constants.DIM);
                        }
                        break;
                    }
                    case 40: { // down
                        if(y < this.constants.DIM*3){
                            $(ph).attr('data-y', y += this.constants.DIM);
                        }
                        break;
                    }
                }// switch
            }// if length
        }// if arrow keys
    },

    actions: {
        // assigns the phase of the project to stamp on the tile
        setStamp() {
            this.set('shiftPhase', false);
            this.set('assignment.stampPhase', this.get('label'))
            this.set('currentRadio', event.target);
            this.unbindKeyDown();
        },

        // user wants to shift phases around
        shift() {
            this.set('shiftPhase', true);
            this.set('currentRadio', event.target);
            this.bindKeyDown();
        },

        // done shifting, reset stamps to nothing
        shiftDone() {
            $(this.get('currentRadio')).prop('checked', false);
            this.set('assignment.stampPhase', null);
            this.set('shiftPhase', false);
            this.unbindKeyDown();
        }
    }
});
