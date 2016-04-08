import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addAssignment(){
            var self = this;
            var d = new Date();
            var newID = d.getFullYear() + "" + this.constants.padout(d.getMonth()+1) + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getMilliseconds();
            var newItem = this.get('store').createRecord('assignment', {
              id: newID,
              short: '',
              long: '',
              background: ""
            });

            this.set('constants.saving', true)
            setTimeout(function(){
                var element = $('[data-assignment-id="' + newItem.id +'"]')[0];
                $(element).attr('tabindex', -1);
                $(element).focus();
                setTimeout(function(){
                    $(element).removeAttr('tabindex');
                }, 2000)
            }, 0)
            //console.log(newItem.id)
            //newItem.save()
            setTimeout(function(){self.set('constants.saving', false)}, 500);
        }
    }
});
