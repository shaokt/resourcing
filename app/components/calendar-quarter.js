import Ember from 'ember';

/*
 * determine quarter properties since fiscal quarters span different calendar years
 * sets this.year as "theYear" for template usage in calendar-widget.hbs
 * only do this once no matter how many times calendar views get loaded
 */
export default Ember.Component.extend({
    tagName: '',
    onload: function(){
        if(this.quarter.done) return;

        // determine the fiscal year this month falls in
        this.quarter.fiscalYear = this.year + this.quarter.year;

        // take the current year and offset by year that the month falls in
        for(var key in this.quarter.months) {
            this.quarter.months[key] += this.year;
        }

        this.quarter.done = true;
    }.on('init')
});
