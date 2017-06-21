import Ember from 'ember';
import ScrollingMixin from "../../mixins/scrolling";
import MouseMoveMixin from "../../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend(ScrollingMixin, MouseMoveMixin, {
    settings: storageFor("settings"),
    queryParams: {
        year: { refreshModel: true }
    },

    // if the year changes, force a reload
    // this is because store.unloadAll() wipes out the model and does not refresh with current year
    checkYear:Ember.computed(function(){
        this.set('constants.reloadRoadmap', this.get('constants.reloadRoadmap')+1);
        if(this.get('constants.reloadRoadmap')%2 === 0){ window.location.reload(); }

    }).property('year'),

    beforeModel: function(transition){
        if(!transition.queryParams.year){
            this.transitionTo(`/roadmap?year=${new Date().getFullYear()}`); // redirect to show current year as a param if not supplied
        }
        else {
            transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
            this.set('year', transition.queryParams.year);
            this.set('settings.view', 'roadmap');
            this.set('constants.assArray', []);
        }
    },

    model() {
        this.get('checkYear');
        return Ember.RSVP.hash({
            assignment: this.get('store').query('assignment', {year:this.get('year')}),
            exists: Ember.$.getJSON(`${this.get('store').adapterFor('assignment').host}/exists/${this.get('year')}/assignments`, ()=> {})
        });
    },

    afterModel: function(){
        this.bindScrolling();
        this.bindMouseMove();
        document.title = `Roadmap | ${this.get('year')}`;
        this.set('constants.editAssignments', false);
    },

    scrolled: function(){ this.constants.scrolled(); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); }
});
