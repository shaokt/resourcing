import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),        // resource name
    ad: DS.attr('string'),          // AD login
    hidden: DS.attr('boolean'),     // if the row is hidden
    assignment: DS.attr('string'),  // tiles showing time away status
    timeaway: DS.attr('string')     // tiles showing time away status
});
