import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    currentYear: (new Date()).getFullYear(),
    qp:'', // query parameter format
    yearPrev: Ember.computed('year', function(){ return parseInt(this.get('year'))-1; }),
    yearNext: Ember.computed('year', function(){ return parseInt(this.get('year'))+1; }),

    path: Ember.computed('router', function(){
        var route = this.get('router.currentRouteName');
        if(route.match(/roadmap/gi)){
            this.set('qp', '?year=');
            return "roadmap";
        }
        else {
            this.set('qp', '&year=');
            return `home?id=${this.get('settings.lastManager')}`;
        }
    }),
    yearPrevPath: Ember.computed(function(){
        return this.get('path') + (parseInt(this.get('yearPrev')) === this.currentYear ? '' : this.get("qp") + this.get('yearPrev'));
    }),
    yearNextPath: Ember.computed(function(){
        return this.get('path') + (parseInt(this.get('yearNext')) === this.currentYear ? '' : this.get("qp") + this.get('yearNext'));
    }),
});
