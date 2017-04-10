import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend(ScrollingMixin, MouseMoveMixin, {
    settings: storageFor("settings"),
    queryParams: {
        year: { refreshModel: true }
    },

    beforeModel: function(transition){
        transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
        this.set('year', transition.queryParams.year);
        this.set('settings.view', 'roadmap');
        this.set('constants.assArray', []);
    },

    model() {
        return Ember.RSVP.hash({
            assignment: this.get('store').query('assignment', {year:this.get('year')}),
            exists: Ember.$.getJSON(`${this.get('store').adapterFor('assignment').host}/exists/${this.get('year')}/assignments`, ()=> {})
        });
    },

    afterModel: function(){
        this.bindScrolling();
        this.bindMouseMove();
    },

    scrolled: function(){ this.constants.scrolled(); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); },
});
