import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    needs:['application'],
    settings: storageFor("settings"),
    queryParams: ['year'],
    year: null,

    hasFile: Ember.computed('model.resource', function(){
        return this.get('model.length') > 0;
    }),

    init: function () {
        Ember.run.scheduleOnce("afterRender",this,()=> {
            this.set('constants.dataView', 'roadmap');
            var route = this.get('router.currentPath');
            if(route === 'roadmap.index'){
                document.title = `${this.get('year')} Roadmap`;
                this.get('settings').set('view', 'roadmap');
                this.bindScrolling();
                this.bindMouseMove();
            }
            else{
                document.title = `${this.get('year')} Roadmap | Edit`;
            }
        });
    },

    scrolled: function(){ this.constants.scrolled(); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); },

    actions: {
        addAssignment(){
            var newItem = this.get('store').createRecord('assignment', {
              id: this.constants.createID(),
              short: '',
              long: '',
              background: ""
            });

            var store = this.get('model');
            newItem.save().then(function(){
                store.pushObject(newItem._internalModel);

                setTimeout(function(){
                    var tr = Ember.$('[data-assignment-id="' + newItem.id +'"] tr');
                    Ember.$(tr).addClass('new');
                    Ember.$(tr).find('.lock a').click();
                    Ember.$(tr).find('.short').focus();
                }, 0);
            });
        }// addAssignment
    }// actions
});
