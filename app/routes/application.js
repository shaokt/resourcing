import Ember from 'ember';
import Resources from '../models/resources';
import Config from '../models/config';

export default Ember.Route.extend({
    model() {
        self = this;
        return Ember.$.getJSON('shao.json').then((data)=> {
            self.config = data.config.map(attrs => this.store.createRecord('config', attrs))
            return data.resources.map(attrs => this.store.createRecord('resources', attrs));
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('config', this.config[0]); // config settings for user session
    },

    actions: {
        updateName(resource) {
            /*
            this.store.findAll('config')
            console.log(this.config[0].get('view'))
            this.config[0].set('view', 'assignment')
            this.config[0].save()
            /**/
        }
    }
});
