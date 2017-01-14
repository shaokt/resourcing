import Ember from 'ember';

export default Ember.Component.extend({
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
        const number = Ember.$(this.get('stamp')).attr('data-num');
        return number ? number : '';
    }),

    actions: {
        updateSPR(){
            Ember.$(this.get('stamp')).attr('data-num', event.target.value);
        },

        updateText(){
        },

        submit(){
            this.get('rowComponent').updateStamp();
            this.get('parentView').send('done');
        },

        back(){
            if(event.keyCode === 13){
                this.send('submit');
            }else{
                this.get('parentView').send('back');
            }
        },
    }
});
