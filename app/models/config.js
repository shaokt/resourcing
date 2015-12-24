import DS from 'ember-data';

export default DS.Model.extend({
    view: DS.attr('string'),
    timeawayTile: DS.attr('string'),
    assignmentTile: DS.attr('string')
});
