import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

const { computed } = Ember;

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    needs:['application'],
    settings: storageFor("settings"),

    init: function () {
        Ember.run.scheduleOnce("afterRender",this,function() {
            this.set('constants.dataView', 'assignment')
            var route = this.get('router.currentPath');
            if(route === 'assignments.index'){
                document.title = "View Assignments";
                this.get('settings').set('view', 'assignment');
                this.bindScrolling();
                this.bindMouseMove();
            }
            else{
                document.title = "Edit Assignments";
                this.get('settings').set('view', '')
            }
        });
    },

    scrolled: function(){ this.constants.scrolled(); },

    mouseMoved: function(event){ this.constants.mouseMoved(event); },

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
