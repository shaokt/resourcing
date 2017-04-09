import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
    queryParams: {
        year: { refreshModel: true }
    },

    beforeModel: function(transition){
        document.title = `${transition.queryParams.year} Manager Listing`;
        transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
        this.set('year', transition.queryParams.year);
    },

    model() {
        return Ember.RSVP.hash({
            assignment: this.get('store').query('manager-listing', {year:this.get('year')})
        });
    }
});
