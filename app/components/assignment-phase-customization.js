import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'div',
    attributeBindings: ['id', 'tabindex'],
    id:'phaseStampCustomization',
    tabindex:0,

    setup:function(){
        Ember.run.scheduleOnce("afterRender",this,()=>{
            this.$().focus();
        });
    }.on('init'),

    left: Ember.computed('rowComponent.stampCustomize', function(){
        const obj = this.get('rowComponent.stampCustomize')[0];
        this.set('stamp', obj);
        this.set('top', obj.offsetTop + obj.offsetHeight);
        return obj.offsetLeft;
    }),
    spr: Ember.computed('rowComponent.stampCustomize', function(){
        return Ember.$(this.get('rowComponent.stampCustomize')).attr('data-phase') === 'SPR';
    }),

    getNum: Ember.computed('rowComponent.stampCustomize', function(){
        const number = $(this.get('stamp')).attr('data-num');
        return number ? number : '';
    }),

    actions: {
        updateSPR() {
            $(this.get('stamp')).attr('data-num', event.target.value);
        }
    }
});
