import Ember from 'ember';
export default Ember.Controller.extend({
    firstLoad: true,
    editing: false,
    digidollars: 0,
    rrsp: false,

    // convert to hex colour
    hexc(colorval) {
        var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        var color = '#' + parts.join('');
        return color;
    },

    // update future colour
    updateColor(item, event, property){
        var color = $(event.target).css('backgroundColor');
        color = this.hexc(color);
        item.set(property, color);
    },

    actions: {
        edit() {
            this.toggleProperty('editing');
            if(this.editing === false) {
                this.send('okayed');
                this.send('save');
            }
        },

        okayed() {
            this.set('firstLoad', false);
        },

        save() { this.get('model').save() },

        dress(item) { this.updateColor(item, event, 'dress'); },

        highlight(item) { this.updateColor(item, event, 'highlight'); },

        lowlight(item) { this.updateColor(item, event, 'lowlight'); },

        lipstick(item) { this.updateColor(item, event, 'lipstick'); },

        necklace(item) { this.updateColor(item, event, 'necklace'); },

        step(num) {
            if(num === 1) {
                this.set('rrsp', false);
                this.set('digidollars', 0);
            }
            if(num === 2) {
                this.set('rrsp', false);
                this.set('digidollars', 3);
            }
            if(num === 3) {
                this.set('rrsp', true);
                this.set('digidollars', 3);
            }
            if(num === 4) {
                this.set('rrsp', true);
                this.set('digidollars', 4);
            }
        }
    }
});
