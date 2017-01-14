import Ember from 'ember';

export default Ember.Component.extend({
    tagName:'div',
    attributeBindings: ['id', 'tabindex'],
    classNames: ['overlay'],
    tabindex:0,

    setup:function(){
        Ember.run.scheduleOnce("afterRender",this,()=>{
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
        });
    }.on('init'),

    actions: {
        back(){
            if(event.keyCode === 9 && event.shiftKey === false){
                var self = this;
                setTimeout(function(){self.$().focus();}, 0);
            }
        }
    }
});
