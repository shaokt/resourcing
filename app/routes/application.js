import Ember from 'ember';
import Resources from '../models/resources';

export default Ember.Route.extend({

    model() {
        self = this;
        return Ember.$.getJSON('shao.json').then((data)=> {
            self.config = data.config.map(attrs => this.store.createRecord('config', attrs))
            return data.employees.map(attrs => this.store.createRecord('resources', attrs));
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('config', this.config[0]); // config settings for user session
    },

    actions: {
        updateName(resource) {
            //console.log(this.blah[0].get('name'))
            /*
            var promises = Ember.A();
            this.blah.forEach(function(item){
                promises.push(item.save());
            });
            /**/
        }
    }
});
