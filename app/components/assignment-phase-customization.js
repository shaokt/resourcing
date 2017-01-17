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
        const weeks = Ember.$(this.get('stamp')).find('.duration').attr('data-weeks');
        return weeks ? weeks : '';
    }),

    getDays: Ember.computed('rowComponent.stampCustomize', function(){
        const days = Ember.$(this.get('stamp')).find('.duration').attr('data-days');
        return days ? days : '';
    }),

    getShortDesc: Ember.computed('rowComponent.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').html();
        return desc ? desc : '';
    }),

    getLongDesc: Ember.computed('rowComponent.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').attr('data-long');
        return desc ? desc : '';
    }),

    getStartsOn: Ember.computed('rowComponent.stampCustomize', function(){
        const startsOn = Ember.$(this.get('stamp')).find('.startsOn').attr('data-startson');
        return startsOn ? startsOn : '';
    }),


    checkEmpty: function(attr){
        return typeof attr !== typeof undefined && attr !== 0 && attr !== '';
    },

    actions: {
        updateSPR(){
            Ember.$(this.get('stamp')).attr('data-num', event.target.value);
            if(event.target.value === '') {
                Ember.$(this.get('stamp')).removeAttr('data-num');
            }
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

        // check if weeks & days are empty - remove duration if so
        checkDuration(){
            const duration = Ember.$(this.get('stamp')).find('.duration');
            const weeks = duration.attr('data-weeks');
            const days = duration.attr('data-days');

            if(!(this.checkEmpty(weeks) && this.checkEmpty(days))){
                Ember.$(this.get('stamp')).find('.duration').remove();
            }
        },

        createDuration(){
            if(!Ember.$(this.get('stamp')).find('.duration').length) {
                const span = Ember.$('<span class="duration"></span>');
                Ember.$(this.get('stamp')).append(span);
            }
        },

        updateWeeks(){
            Ember.$(this.get('stamp')).find('.duration').attr('data-weeks', parseInt(event.target.value) || 0);
            if(event.target.value < 1) {
                Ember.$(this.get('stamp')).removeAttr('data-width');
            }
            else {
                Ember.$(this.get('stamp')).attr('data-width', event.target.value * 15);
            }
        },

        updateDays(){
            Ember.$(this.get('stamp')).find('.duration').attr('data-days', event.target.value);
            /*1-4 days only*/
            if(event.target.value < 1) {
                Ember.$(this.get('stamp')).removeAttr('data-padding');
            }
            else {
                Ember.$(this.get('stamp')).attr('data-padding', event.target.value);
            }
        },

        checkStartsOn(){
            if(Ember.$(this.get('stamp')).find('.startsOn').attr('data-startson') === 'M'){
                Ember.$(this.get('stamp')).find('.startsOn').remove();
                Ember.$(this.get('stamp')).removeAttr('data-startson');
            }
        },

        createStartsOn(){
            if(!Ember.$(this.get('stamp')).find('.startsOn').length) {
                const span = Ember.$('<span class="startsOn"></span>');
                Ember.$(this.get('stamp')).append(span);
            }
        },

        updateStartsOn(){
            Ember.$(this.get('stamp')).find('.startsOn').attr('data-startson', event.target.value);
            Ember.$(this.get('stamp')).attr('data-startson', event.target.value);
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
        }
    }
});
