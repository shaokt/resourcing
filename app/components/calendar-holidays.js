import Ember from 'ember';

export default Ember.Component.extend({
	boxingDay:0,
	christmasEve:0,
	// get next weekday for holidays on weekends
	getHolidayWeekday: function(date){
		var date2 = new Date(date);
		var theDay = date2.getDay();
		if(theDay === 0 || theDay === 6){ // weekend, go to Monday
			while(theDay === 0 || theDay === 6){
				theDay = new Date(date2);
				theDay.setDate(theDay.getDate() + 1);
				date2 = new Date(theDay);
				theDay = theDay.getDay();
			}
			return date2.getFullYear() + " " + ("0" + (date2.getMonth() + 1)).slice(-2) + " " + date2.getDate();
		}
		else{ return date; }
	},

	// return all mondays or specific monday
	getMonday: function(year, month, number){
		var d = new Date(year, --month), mondays = [];
		d.setDate(1);

		// Get the first Monday in the month
		while (d.getDay() !== 1) { d.setDate(d.getDate() + 1); }

		// Get all the other Mondays in the month
		while (d.getMonth() === month) {
			mondays.push(d.getDate());
			d.setDate(d.getDate() + 7);
		}

		if(number){ return mondays[number-1]; }
		else{ return mondays; }
	},

    getDates: function(){
		var easter = this.Easter(this.year);
		var easterNext = this.Easter(this.year+1);
		easter.setDate(easter.getDate() - 2);
		easterNext.setDate(easterNext.getDate() - 2);
        this.collection = {
			newYear: { name:"New Year", date: this.getHolidayWeekday(this.year + " 01 1") },
			familyDay: { name:"Family Day", date: this.year + " 02 " + this.getMonday(this.year, 2, 3)}, // 3rd Monday in February
			goodFriday: { name:"Good Friday", date: this.year + " " + ("0" + (easter.getMonth() + 1)).slice(-2) + " " + easter.getDate()},
			victoriaDay: { name:"Victoria Day", date: this.VictoriaDay(this.year)}, // Monday before May 25
			canadaDay: { name:"Canada Day", date: this.getHolidayWeekday(this.year + " 07 1") },
			civicHoliday: { name:"Civic Holiday", date: this.year + " 08 " + this.getMonday(this.year, 8, 1)}, // 1st Monday in August
			labourDay: { name:"Labour Day", date: this.year + " 09 " + this.getMonday(this.year, 9, 1)}, // 1st Monday in September
			thanksgiving: { name:"Thanksgiving", date: this.year + " 10 " + this.getMonday(this.year, 10, 2)}, // 2nd Monday in October

			christmas: { name:"Christmas", date: this.Christmas(this.year) },
			boxingDay: { name:"Boxing Day", date: this.boxingDay},
			christmasEve: { name:"Christmas Eve", date: this.christmasEve },

			newYearNext: { name:"New Year", date: this.getHolidayWeekday(this.year+1 + " 01 1") },
			familyDayNext: { name:"Family Day", date: this.year+1 + " 02 " + this.getMonday(this.year+1, 2, 3)}, // 3rd Monday in February
			goodFridayNext: { name:"Good Friday", date: this.year+1 + " " + ("0" + (easterNext.getMonth() + 1)).slice(-2) + " " + easterNext.getDate()},
			victoriaDayNext: { name:"Victoria Day", date: this.VictoriaDay(this.year+1)}, // Monday before May 25
        };
    },

	// calculate easter
	Easter: function(year) {
		var C = Math.floor(year/100);
		var N = year - 19*Math.floor(year/19);
		var K = Math.floor((C - 17)/25);
		var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
		I = I - 30*Math.floor((I/30));
		I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
		var J = year + Math.floor(year/4) + I + 2 - C + Math.floor(C/4);
		J = J - 7*Math.floor(J/7);
		var L = I - J;
		var M = 3 + Math.floor((L + 40)/44);
		var D = L + 28 - 31*Math.floor(M/4);

		return new Date(year + " " + this.constants.padout(M) + ' ' + D);
	},

	// calculate Victoria Day - Monday before May 25th
	VictoriaDay: function(year){
		var date = new Date(year, "04", "24");
		var theDay = date.getDay();
		while(theDay !== 1){
			date = new Date(date.setDate(date.getDate() - 1));
			theDay = date.getDay();
		}
		return(date.getFullYear() + " 05 " + date.getDate());
	},

	// calculate holdays for Dec 24, 25, 26 which can be on weekends and overlap with each other
	Christmas: function(year){
		var xmas = new Date(year, "11", "25");
		var xmasDay = xmas.getDay();

		if(xmasDay == 1){ // Xmas is on a Monday
			this.boxingDay = this.getHolidayWeekday(year + " 12 26");
			this.christmasEve= this.getHolidayWeekday(year + " 12 27");
		}
		else if(xmasDay >= 2 && xmasDay <= 4){ // Xmas is on a Tuesday, Wednesday, Thursday
			this.christmasEve= this.getHolidayWeekday(year + " 12 24");
			this.boxingDay = this.getHolidayWeekday(year + " 12 26");
		}
		else if(xmasDay == 5){ // Xmas is on a Friday
			this.christmasEve= this.getHolidayWeekday(year + " 12 24");
			this.boxingDay = this.getHolidayWeekday(year + " 12 28");
		}
		else if(xmasDay == 6){ // Xmas is on a Saturday
			this.christmasEve= this.getHolidayWeekday(year + " 12 24");
			this.boxingDay = this.getHolidayWeekday(year + " 12 28");
			return this.getHolidayWeekday(year + " 12 27");
		}
		else{ // Xmas is on a Sunday
			this.boxingDay = this.getHolidayWeekday(year + " 12 26");
			this.christmasEve= this.getHolidayWeekday(year + " 12 27");
			return this.getHolidayWeekday(year + " 12 28");
		}

		return this.getHolidayWeekday(year + " 12 25");
	},

	/*	mark holidays on the calendar & save the coloumn values for highlighting/overlaying for resesource views
	*/
    display: function(){
		var columns = [];
		Ember.$.each(this.collection, function(key, value){
			var thisHoliday = Ember.$("#calendarDaily").find("[data-date = '" + value.date + "']");
			Ember.$(thisHoliday).addClass('holiday').attr("data-holiday", value.name);
			columns.pushObject(parseInt(Ember.$(thisHoliday).attr("data-column")));
        });
		this.set('constants.holidayColumns', columns.uniq());
    }
});
