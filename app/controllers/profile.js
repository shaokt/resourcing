import Ember from 'ember';
export default Ember.Controller.extend({

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

    actions: {
        save() {
            this.get('model').save()
        },

        dress(item) {
            var color = $(event.target).css('backgroundColor');
            item.set('dress', color);
            this.send('save');
        },

        highlight(item) {
            var color = $(event.target).css('backgroundColor');
            color = this.hexc(color);
            item.set('highlight', color);
            this.send('save');
        },

        lowlight(item) {
            var color = $(event.target).css('backgroundColor');
            color = this.hexc(color);
            item.set('lowlight', color);
            this.send('save');
        },

        lipstick(item) {
            var color = $(event.target).css('backgroundColor');
            item.set('lipstick', color);
            this.send('save');
        },

        necklace(item) {
            var color = $(event.target).css('backgroundColor');
            color = this.hexc(color);
            item.set('necklace', color);
            this.send('save');
        },
    }
});
