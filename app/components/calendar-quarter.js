import Ember from 'ember';

// determine quarter properties since fiscal quarters span different calendar years
export default Ember.Component.extend({
    // sets this.year as "theYear" for template usage in calendar-widget.hbs
    tagName: '',
    onload: function(){
        if(this.quarter.year == -1){
            this.quarter.monthYear = this.year;
            this.quarter.months["Nov"] = this.year-1;
            this.quarter.months["Dec"] = this.year-1;
            this.quarter.months["Jan"] = this.year;
        }
        else if(this.quarter.year == 1){
            this.quarter.monthYear = this.year+1;
            this.quarter.months["Nov"] = this.year;
            this.quarter.months["Dec"] = this.year;
            this.quarter.months["Jan"] = this.year+1;
        }
        else{
            this.quarter.monthYear = this.year;
            for(var key in this.quarter.months) {
                this.quarter.months[key] = this.year;
            }
        }
    }.on('init')
});
