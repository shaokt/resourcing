import Ember from 'ember';

export default Ember.Component.extend({
    showLongDesc: Ember.computed('rowComponent.stampCustomize', function(){
        return this.get('getShortDesc') !== '';
    }),

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

    getWeeks: Ember.computed('rowComponent.stampCustomize', function(){
        const weeks = Ember.$(this.get('stamp')).attr('data-weeks');
        return weeks ? weeks : '';
    }),

    getShortDesc: Ember.computed('rowComponent.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').html();
        return desc ? desc : '';
    }),

    getLongDesc: Ember.computed('rowComponent.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').attr('data-long');
        return desc ? desc : '';
    }),

    actions: {
        updateSPR(){
            Ember.$(this.get('stamp')).attr('data-num', event.target.value);
        },

        checkShortDesc(){
            if(this.get('getShortDesc') === ''){
                Ember.$(this.get('stamp')).find('.desc').remove();
            }
        },

        createShortDesc(){
            if(!Ember.$(this.get('stamp')).find('.desc').length) {
                const span = Ember.$('<span class="desc"></span>');
                Ember.$(this.get('stamp')).append(span);
            }
        },

        updateShortDesc(){
            Ember.$(this.get('stamp')).find('.desc').html(event.target.value);
            if(event.target.value === '') {
                this.set('showLongDesc', false);
            }
            else {
                this.set('showLongDesc', true);
            }
        },

        updateLongDesc(){
            Ember.$(this.get('stamp')).find('.desc').attr('data-long', event.target.value);
        },

        updateWeeks(){
            Ember.$(this.get('stamp')).attr('data-weeks', event.target.value);
            if(event.target.value < 1) {
                Ember.$(this.get('stamp')).removeAttr('style');
                Ember.$(this.get('stamp')).removeAttr('data-weeks');
            }
            else {
                Ember.$(this.get('stamp')).css({width:event.target.value * 15});
            }

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
