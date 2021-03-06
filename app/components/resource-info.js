import Ember from 'ember';
import ResourceRowComponent from "./resource-row";
import { storageFor } from 'ember-local-storage';

export default ResourceRowComponent.extend({
    tagName: 'div',
    attributeBindings: ['tabindex'],
    tabindex:0,
    classNames: ['info'],
    classNameBindings: ['editing'],
    collapse: '',
    hasDirects: false,
    editing: false,
    deletingTiles: false,
    lockable: true,
    settings: storageFor("settings"),

    didRender(){
        const url = this.get('store').adapterFor('assignment').host;
        if(this.get('router.currentRouteName') === 'home'){
            this._super(...arguments);
            var self = this;

            if(this.get('resource.ad')){
                var exists = Ember.$.getJSON(`${url}/exists/${this.get('constants.year')}/${this.get('resource.ad')}`, function() {})
                .done(function() {
                    self.set('hasDirects', exists.responseJSON ? true : false);
                });
            }
        }
    },

    mouseEnter(e) {
        this.updateCounters(e);
    },

    focusIn(e) {
        this.updateCounters(e);
    },

    actions: {
        // open a row up for edit by unlocking
        editing() {
            this.toggleProperty('editing');
            this.set("resource.active", this.editing);
            this.set('phaseAction', "");

            if(this.editing === true){
                this.edit();
                this.set('constants.editingRow', true);
                var self = this;

                // resource === assignment in this block due to shared code
                if(this.get('router.currentRouteName') === 'roadmap.index'){
                    this.set('resource.paint', true);
                    setTimeout(function(){
                        self.constants.webcel.setTile(Ember.$(self.element).find('.tileOptions li a[data-assignment="' + self.get('resource.id') + '"]'));
                    }, 0);
                }
            }
            else {
                this.set('constants.editingRow', false);
                if(this.get('resource.toDelete')){
                    this.get('resource').destroyRecord();

                } else {
                    this.save();
                }
            }
        },

        // show/hide direct reports
        toggleDirects() {
            if(this.collapse === ''){
                this.set('resource.directs', this.get('store').query('user', {year: this.get('constants.year'), manager: this.get('resource.ad')}));
                this.set('resource.expanded', true);
                this.set('collapse', 'collapse');
            }
            else{
                this.set('resource.directs', null);
                this.set('resource.expanded', false);
                this.set('collapse', '');
            }
        },

        toggleRow() {
            this.$().parent().toggleClass('hidden');
            this.set('resource.hidden', this.$().parent().hasClass('hidden'));
            this.constants.save(this.get('resource'));
        },

        // filter for contenteditable name field
        filter(currentValue, event) {
            const keyCode = event.which;
            if(keyCode === 13) { this.send('editName'); }
        },

        // determines if we want to delete the painted tile or not
        deleteTiles() {
            this.toggleProperty('deletingTiles');
            this.constants.webcel.deleteTile(event.target.checked);
        },

        deleteUser(e) {
            this.set('lockable', !Ember.$(e.target).prop('checked'));
            this.set('resource.toDelete', Ember.$(e.target).prop('checked'));
        },

        confirmDeleteUser() {
            this.set('lockable', true);
        },

        // TODO:  send the name back up for saving
        editName() {
            this.send('editing');
        }
    }//actions
});
