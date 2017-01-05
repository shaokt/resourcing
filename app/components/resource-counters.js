import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    classNames: ['counters'],

    vacation: Ember.computed('resource.vacation', function(){
        return(this.get('resource.vacation'));
    }),

    vacationToDate: Ember.computed('resource.vacationToDate', function(){
        return(this.get('resource.vacationToDate'));
    }),

    personal: Ember.computed('resource.personal', function(){
        return(this.get('resource.personal'));
    })
});
