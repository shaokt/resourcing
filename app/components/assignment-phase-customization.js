import Ember from 'ember';

export default Ember.Component.extend({
    updatedStartDate: Ember.computed('assignment.stampCustomize', function(){
        let sd = Ember.$(this.get('assignment.stampCustomize')).attr('data-startson');
        sd = sd || "M"; // assume monday if no start day specified
        return sd;
    }),

    updatedWeeks: Ember.computed('assignment.stampCustomize', function(){
        let d = Ember.$(this.get('assignment.stampCustomize')).find('.duration');
        d = d.attr('data-weeks') || 0; // assume monday if no start day specified
        return d;
    }),

    updatedDays: Ember.computed('assignment.stampCustomize', function(){
        let d = Ember.$(this.get('assignment.stampCustomize')).find('.duration');
        d = d.attr('data-days') || 0; // assume monday if no start day specified
        return d;
    }),

    showLongDesc: Ember.computed('assignment.stampCustomize', function(){
        return this.get('getShortDesc') !== '';
    }),

    left: Ember.computed('assignment.stampCustomize', function(){
        const obj = this.get('assignment.stampCustomize')[0];
        this.set('stamp', obj);
        this.set('top', obj.offsetTop + obj.offsetHeight);
        return obj.offsetLeft;
    }),
    spr: Ember.computed('assignment.stampCustomize', function(){
        return Ember.$(this.get('assignment.stampCustomize')).attr('data-phase') === 'SPR';
    }),

    getNum: Ember.computed('assignment.stampCustomize', function(){
        const number = Ember.$(this.get('stamp')).attr('data-num');
        return number ? number : '';
    }),

    getWeeks: Ember.computed('assignment.stampCustomize', function(){
        const weeks = Ember.$(this.get('stamp')).find('.duration').attr('data-weeks');
        return weeks ? weeks : '';
    }),

    getDays: Ember.computed('assignment.stampCustomize', function(){
        const days = Ember.$(this.get('stamp')).find('.duration').attr('data-days');
        return days ? days : '';
    }),

    getShortDesc: Ember.computed('assignment.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').html();
        return desc ? desc : '';
    }),

    getLongDesc: Ember.computed('assignment.stampCustomize', function(){
        const desc = Ember.$(this.get('stamp')).find('.desc').attr('data-long');
        return desc ? desc : '';
    }),

    getStartsOn: Ember.computed('assignment.stampCustomize', function(){
        const startsOn = Ember.$(this.get('stamp')).find('.startsOn').attr('data-startson');
        return startsOn ? startsOn : '';
    }),

    shiftStartDay: {S:-2, N:-1, M:0, T:1, W:2, R:3, F:4},

    getFromDay: function(){
        let shiftDay = this.shiftStartDay[this.get('updatedStartDate')];
        if(!this.get('calDate')){ this.setCalendarDay(); }
        let sd = new Date(this.get('calDate'));
        sd.setDate(sd.getDate() + shiftDay);
        this.set('fromDate', sd.toDateString());
        return sd.toDateString();
    }.property('updatedStartDate'),

    getToDay: function(){
        const fromDate = new Date(this.get('fromDate'));
        let duration = parseInt(this.get('updatedWeeks'))*7 + parseInt(this.get('updatedDays'));
        if(fromDate.getDay() === 1 && duration%7 === 0){ //if Monday & perfect weeks
            duration = duration - 2; // assume we do not end phases on the weekend
        }
        if(duration){ --duration; } // this ensures it shows the proper end date for duration
        fromDate.setDate(fromDate.getDate() + duration);
        return fromDate.toDateString();
    }.property('updatedWeeks', 'updatedDays', 'updatedStartDate'),

    setCalendarDay: function(col){
        const x = Ember.$(this.get('stamp')).attr('data-x');
        const calDate = Ember.$('.calendar').find(`[data-column="${x}"]`).attr('data-date');
        this.set('calDate', calDate);
    },

    isEmpty: function(attr){
        return typeof attr === typeof undefined || parseInt(attr) === 0 || attr === '';
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

            if(this.isEmpty(weeks) && this.isEmpty(days)){
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
            const duration = Ember.$(this.get('stamp')).find('.duration');
            const value = parseInt(event.target.value) || 0;
            duration.attr('data-weeks', value);
            this.set('updatedWeeks', value);
            if(event.target.value === '') {
                if(this.isEmpty(duration.attr('data-days'))){
                    Ember.$(this.get('stamp')).removeAttr('data-width');
                }
                else {
                    Ember.$(this.get('stamp')).attr('data-width', 0);
                }
            }
            else {
                Ember.$(this.get('stamp')).attr('data-width', event.target.value * 15);
            }
        },

        updateDays(){
            if(event.target.value === '0'){
                Ember.$(this.get('stamp')).find('.duration').removeAttr('data-days');
                Ember.$(this.get('stamp')).removeAttr('data-padding');
                this.set('updatedDays', 0);
            }
            else{
                Ember.$(this.get('stamp')).find('.duration').attr('data-days', event.target.value);
                Ember.$(this.get('stamp')).attr('data-padding', event.target.value);
                this.set('updatedDays', event.target.value);
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
            this.set('updatedStartDate', event.target.value);
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
