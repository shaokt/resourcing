import DS from 'ember-data';

export default DS.Model.extend({
    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    email: DS.attr('string'),
    mobile: DS.attr('string'),
    mailingaddress: DS.attr('string'),
    highlight: DS.attr('string'),
    lowlight: DS.attr('string'),
    dress: DS.attr('string'),
    lipstick: DS.attr('string'),
    necklace: DS.attr('string')
});
