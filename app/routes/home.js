import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend(ScrollingMixin, MouseMoveMixin, {
    settings: storageFor("settings"),
    minLeft: 0, // the minimum left position to show names when scrolling
    queryParams: {
        id: { refreshModel: true },
        year: { refreshModel: true }
    },

    // if the year changes, force a reload
    // this is because store.unloadAll() wipes out the model and does not refresh with current year
    checkYear:Ember.computed(function(){
        this.set('constants.reloadManager', this.get('constants.reloadManager')+1);
        if(this.get('constants.reloadManager')%2 === 0){ window.location.reload(); }

    }).property('year'),

    beforeModel: function(transition){
        transition.queryParams.year = transition.queryParams.year || (new Date().getFullYear());
        this.set('id', transition.queryParams.id);
        this.set('year', transition.queryParams.year);
        this.set('settings.lastManager', this.id);
        this.set('constants.assArray', []);
    },

    model() {
        this.get('checkYear');
        return Ember.RSVP.hash({
            resource: this.get('store').query('user', {year: this.get('year'), manager: this.get('id')}),
            exists: Ember.$.getJSON(`${this.get('store').adapterFor('assignment').host}/exists/${this.get('year')}/${this.get('settings.lastManager')}`, ()=> {}),
            assignment: this.get('store').query('assignment', {year:this.get('year')})
        });
    },

    afterModel: function(){
        this.minLeft = 22 * this.constants.DIM; // assume 22 business days in a month
        this.bindScrolling();
        this.bindMouseMove();
        document.title = `${this.get('year')} ${this.get('settings.lastManager')} ${this.get('settings.view') === 'timeaway' ? ' | Time Off' : ' | Roadmap'}`;
    },

    scrolled: function(){ this.constants.scrolled(this.minLeft); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); },

    setupController(controller, model) {
        this._super(controller, model);
    },
});
