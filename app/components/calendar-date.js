import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    dayInMonth: function(){
        if(this.constants._nextYear == 0){
            if(this.year == this.cal.year+1){
                this.constants.nextYear = this.constants._nextYear = this.constants._DIM + this.constants.DIM
            }
        }
        if(this.constants._prevYear == 0){
            if(this.year == this.cal.year){
                //Ember.set(this.constants, 'prevYear', this.constants._DIM)
                this.set('constants.prevYear', this.constants._DIM + this.constants.DIM)
                this.constants._prevYear = this.constants._DIM
            }
        }

        this.days = new Array();
        this.cal.getLastDayInMonth(this.year, this.month);

        for(var i=1; i<this.cal.lastDay+1; i++){
            this.cal.setDate(this.year, this.month, i);

            var condition = this.daily ?
                this.cal.dayName != "S" : // do not look at Sat & Sun
                this.cal.dayName == "M";  // only look at Mondays

			if(condition){
				this.constants.numDays++;
                this.days.pushObject({
                    "name": this.cal.dayName,
                    "data-column": this.constants._DIM+=this.constants.DIM,
                    "data-date": this.year + " " + this.cal.months[this.month] + " " + this.cal.dayNum,
                    "num": this.cal.dayNum
                })
            }
        }
    }.on('init'),

    actions: {
        setDate() {
            if(this.get('constants.dataView') === 'timeaway' || !this.constants.teamAssignmentView) return;
            var obj;
            if($(event.target)[0].className !== 'day') { obj= $(event.target.parentNode); }
            else { obj = $(event.target) }
            this.set('constants.teamAsOf',obj.attr('data-column'));
            var month =  obj.parent().find('pre').html().replace(/<.*>/, '');
            var day =  obj.find('.dayNum').html();
            this.set('constants.teamAsOfDate', month + " " + day);
        }
    }
});
