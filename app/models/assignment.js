import DS from 'ember-data';

export default DS.Model.extend({
    hidden: DS.attr('boolean'),     // if the row is hidden
    short: DS.attr('string'),       // short description
    long: DS.attr('string'),        // long description
    assignment: DS.attr('string'),  // tiles showing assignment
    phases: DS.attr('string'),      // phases of the project
    background: DS.attr('string')   // hex background
});
