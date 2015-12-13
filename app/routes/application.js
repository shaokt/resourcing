import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        // Render default outlet
        this.render();

        // render extra outlets
        /*
        this.render("calendar", {
            outlet: "calendar",
            into: "application" // important when using at root level
        });
        /* */
    }
});
