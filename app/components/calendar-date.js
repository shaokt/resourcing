import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    dayInMonth: function(){
        if(this.constants.nextYear == 0){
            if(this.year == this.cal.year+1){
                this.constants.nextYear = this.constants._DIM + this.constants.DIM
            }
        }
        if(this.constants.prevYear == 0){
            if(this.year == this.cal.year){
                this.constants.prevYear = this.constants._DIM
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
    }.on('init')
    /*
    generateDays: function() {
        this.set("lastDay", (new Date(this.year, this.months[this.month], 0).getDate()));
    	$(this.selector).html("");
        this.result = "";

        for(var i=1; i<=this.lastDay; i++){
			var dayName = this.dayNames[(new Date(this.year, this.months[this.month] -1 , i).getDay())]
			var theDay = i < 10 ? "0" + i : i;
			if(dayName != "S"){
				var divDay = $("<div>").addClass("day").attr("data-column", this.constants._DIM+=this.constants.DIM).attr("data-date", this.year + " " + this.months[this.month] + " " + theDay).attr("data-dayname", dayName);
				this.constants.numDays++;
				divDay.html("<div class='dayName'>" + dayName + "</div><div class='dayNum'>" + i + "</div>");
                this.result += divDay[0].outerHTML;
            }
        }
    }.on('init'),
    */
});
