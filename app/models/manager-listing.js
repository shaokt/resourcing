import DS from 'ember-data';

export default DS.Model.extend({
    ad: DS.attr('string')        // AD login of the manager
});
