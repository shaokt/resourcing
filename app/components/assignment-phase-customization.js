import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'',
        left: Ember.computed('rowComponent.stampCustomize', function(){
        const obj = this.get('rowComponent.stampCustomize')[0];
        return obj.offsetLeft + obj.offsetWidth;
    }),
    top: Ember.computed('rowComponent.stampCustomize', function(){
        const obj = this.get('rowComponent.stampCustomize')[0];
        return obj.offsetTop;
    }),
    spr: Ember.computed('rowComponent.stampCustomize', function(){
        return Ember.$(this.get('rowComponent.stampCustomize')).attr('data-phase') === 'SPR';
    })
});
