import Ember from 'ember';
import ScrollingMixin from "../mixins/scrolling";
import MouseMoveMixin from "../mixins/mousemove";
import { storageFor } from 'ember-local-storage';

const { computed } = Ember;

export default Ember.Controller.extend(ScrollingMixin, MouseMoveMixin, {
    needs:['application'],
    settings: storageFor("settings"),

    init: function () {
        this._super();
        Ember.run.schedule("afterRender",this,function() {
            var route = this.get('router.currentPath');
            if(route === 'assignments.index'){
                document.title = "View Assignments"
                this.get('settings').set('view', 'assignment')
            this.bindScrolling();
            this.bindMouseMove();
            }
            else{
                document.title = "Edit Assignments"
                this.get('settings').set('view', '')
            }
    });
},

    scrolled: function(){
        var left = $(window).scrollLeft()
        this.set('leftScroll', left == 0 && this.get('settings.view') == 'timeaway' ? this.minLeft : left)
        $('.calendar').css({left:-left})
    },

    mouseMoved: function(event){
    	var pos = event.pageX - 75; // 75 determined via css margin/padding page offset
        var max = this.constants.calWidth - this.constants.DIM;
    	pos = pos - pos%this.constants.DIM;
    	pos <= 0 ? pos = 0 : 0;
		pos = pos >= max ? max : pos;
        this.set('mousePos', pos)
    },

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
