import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    timeaway: DS.attr('string')
});
