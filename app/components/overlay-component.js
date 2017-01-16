import Ember from 'ember';
import KeyDownMixin from "../mixins/keydown";

//export default Ember.Component.extend({
export default Ember.Component.extend(KeyDownMixin, {
    tagName:'div',
    attributeBindings: ['id', 'tabindex'],
    classNames: ['overlay'],
    tabindex:0,

    setup:function(){
        Ember.run.scheduleOnce("afterRender",this,()=>{
            var self = this;
            this.set('constants.overlay', this.$());
            this.$()[0].onclick = function(){ event.stopPropagation(); };
            this.$()[0].onfocus = function(){
                this.onkeydown = function(){
                    if(event.keyCode === 9 && event.shiftKey) {
                        Ember.$('#overlayDone').focus();
                    }
                };
            };// onfocus

            this.$()[0].onblur = function(){
                this.onkeydown = null;
            };
            this.$().focus();
            Ember.$('body').attr('data-overlay', true);
            Ember.$('body')[0].onclick = function() {
                self.$().focus();
            };
        });
    }.on('init'),

    keyDown: function(event){
        if(event.keyCode === 27) {
            event.preventDefault();
            this.get('initiator').cancelOverlay();
            this.send('done');
        }
    },

    actions: {
        back(){
            if(event.keyCode === 9 && event.shiftKey === false){
                var self = this;
                setTimeout(function(){self.$().focus();}, 0);
            }
        },

        done() {
            Ember.$('body').removeAttr('data-overlay');
            Ember.$('body')[0].onclick = function() { };
        }
    }
});
