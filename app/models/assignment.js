import DS from 'ember-data';

export default DS.Model.extend({
    short: DS.attr('string'),
    long: DS.attr('string'),
    background: DS.attr('string')
});
