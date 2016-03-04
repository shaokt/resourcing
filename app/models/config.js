import DS from 'ember-data';

export default DS.Model.extend({
    view: DS.attr('string'),                // the view last used (i.e. assignment, timeaway)
    timeawayTile: DS.attr('string'),        // the last selected tile used for painting
    assignmentTile: DS.attr('string'),      // the last selected tile used for painting
    showHiddenRows: DS.attr('boolean')      // whether or not hidden rows are visible
});
