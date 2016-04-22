import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addAssignment(){
            var newItem = this.get('store').createRecord('assignment', {
              id: this.constants.createID(),
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
