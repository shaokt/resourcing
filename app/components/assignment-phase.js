import Ember from 'ember';
import KeyDownMixin from "../mixins/keydown";

export default Ember.Component.extend(KeyDownMixin, {
    tagName: 'li',
    currentRadio: null,
    classNameBindings: ['id'],
    id: Ember.computed('label', function() {
        return 'phase' + this.get('label');
    }),

    keyDown: function(event) {
        // do not allow scrolling when pressing arrow keys
        if(!event.target.type && [32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
            if(this.get('phaseToShift').length){
                var ph = this.get('phaseToShift')[0];

    			switch (event.keyCode){
                    case 37: {
                        console.log('L')
                        break;
                    }
                    case 38: {
                        console.log('U')
                        break;
                    }
                    case 39: {
                        console.log('R')
                        break;
                    }
                    case 40: {
                        console.log('D')
                        break;
                    }
                }
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
