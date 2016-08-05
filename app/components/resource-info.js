import Ember from 'ember';
import ResourceRowComponent from "./resource-row";

//export default Ember.Component.extend(ResourceRowComponent, {
export default ResourceRowComponent.extend({
    tagName: 'div',
    classNames: ['info'],
    classNameBindings: ['editing'],
    collapse: '',
    editing: false,

    didRender(){
        if(this.get('router.currentRouteName') === 'home'){
            this._super(...arguments);
            var self = this;

            var exists = $.getJSON('http://localhost:3000/file/' + this.get('resource.ad'), function() {})
            .done(function() {
                self.set('resource.hasDirects', exists.responseJSON ? true : false);
            })
        }
    },

    actions: {
        // open a row up for edit by unlocking
        editing() {
            this.toggleProperty('editing');
            this.set("resource.active", this.editing);
            this.set('shiftPhase', false); // reset so that the row doesn't go opaque on edit of next row
            this.set('stampPhase', false);

            if(this.editing == true){
                this.edit();
                this.set('constants.editingRow', true);
                var self = this;

                // resource === assignment in this block due to shared code
                if(this.get('router.currentRouteName') === 'assignments.index'){
                    this.set('resource.paint', true)
                    setTimeout(function(){
                        self.constants.webcel.setTile($(self.element).find('.tileOptions li a[data-assignment="' + self.get('resource.id') + '"]'));
                    }, 0);
                }
            }
            else {
                this.set('constants.editingRow', false);
                this.save();
            }
        },

        // show/hide direct reports
        toggleDirects() {
            if(this.collapse === ''){
                this.set('resource.directs', this.get('store').query('direct', {manager: this.get('resource.ad')}));
                this.set('resource.expanded', true);
                this.set('collapse', 'collapse')
            }
            else{
                this.set('resource.directs', null);
                this.set('resource.expanded', false);
                this.set('collapse', '')
            }
        },

        toggleRow() {
            this.$().parent().toggleClass('hidden');
            this.set('resource.hidden', this.$().parent().hasClass('hidden'));
            this.constants.save(this.get('resource'))
        },

        // filter for contenteditable name field
        filter(currentValue, event) {
            const keyCode = event.which;
            keyCode == 13 ? this.send('editName') : 0
        },

        // TODO:  send the name back up for saving
        editName() {
            this.send('editing')
        }
    }//actions
});
