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

            // highligh new row & focus into first editable field
            setTimeout(function(){
                var tr = $('[data-assignment-id="' + newItem.id +'"] tr');
                $(tr).addClass('new');
                $(tr).find('.lock a').click();
                setTimeout(function(){
                    $(tr).find('.short').focus();
                }, 0)
            }, 0)
            this.constants.save(newItem)
        }
    }
});
