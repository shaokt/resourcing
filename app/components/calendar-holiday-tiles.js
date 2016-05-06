import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
    columns: Ember.computed.alias('constants.holidayColumns'),
});
