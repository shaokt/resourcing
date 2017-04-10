import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
    needs:['application'],
    settings: storageFor("settings"),
    queryParams: ['year'],
    year: null,
    numAssignmentsViewing: function(){
        let height = this.get('constants.teamAssignment.rows');
        height = height ? (height*15)+60 : 60; // 60=height of each assignment row
        return height + 25; // 25px to account for the project name now being on top of the row
    }.property('constants.teamAssignment'),

    isEmpty: Ember.computed('model.assignment', function(){
        return this.get('model.length') === 0;
    }).property('model.assignment.length'),

    showInRoadmap: function(){
        let list = '';
        this.get('model.assignment').forEach((item)=> {
            if(Ember.$.inArray(item.id, this.get('constants.assArray')) !== -1){
                list += `[data-id="${item.id}"],`;
            }
        });
        this.set('roadmapList', list.replace(/,$/, ''));

        return list !== '';

    }.property('constants.assArray'),

    init: function () {
        Ember.run.scheduleOnce("afterRender",this,()=> {
            this.set('constants.dataView', 'roadmap');
            var route = this.get('router.currentPath');
            if(route === 'roadmap.index'){
                this.get('settings').set('view', 'roadmap');
            }
        });
    },

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
