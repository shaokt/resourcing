import Ember from 'ember';
/*
import Resources from '../models/resource';
import Config from '../models/config';
/**/

export default Ember.Route.extend({
    model() {
        /*
        self = this;
        return Ember.$.getJSON('shao.json').then((data)=> {
            self.config = data.config.map(attrs => this.store.createRecord('config', attrs))
            return data.resources.map(attrs => this.store.createRecord('resource', attrs));
        });
        /**/

        // return this.store.findAll('resource');
        return Ember.RSVP.hash({
            resource: this.get('store').findAll('resource'),
            vacation: Ember.Object.create()
        });
        //return Ember.RSVP.hash({model: this.store.findAll('resource')});
        //var blah = this.get('store').findAll('resource');
        //return blah

        /*
        return this.get('store').findAll('resource').then(function (data) {
            console.log(data.objectAt(1))
            return data.objectAt(1)
        });
        /**/

        /*
        return this.get('store').findAll('resource').then(function (data) {
            console.log(data.objectAt(1))
            return {
                data: data.map(attrs => {
                  type: 'resource',
                  id: attrs.id,
                  attributes: attrs
                })
              };
        });
        /**/

    },

    setupController(controller, model) {
        this._super(controller, model.resource);

        controller.set('vacation', model.vacation);
    },

    // setupController: function(controller, model) {
    //     /*
    //     this._super(controller, model);
    //     controller.set('config', this.config[0]); // config settings for user session
    //     /**/
    //     this._super(controller, model);
    //
    //     controller.set('config', {"view":"timeaway"}); // config settings for user session
    // },
    /**/

    actions: {
        // updateName(resource) {
        //this.get('model').objectAt(0).get('name')
        //     console.log(3);
        //     this.get('controller.model').save();
        //     /*
        //     this.store.findAll('config')
        //     console.log(this.config[0].get('view'))
        //     this.config[0].set('view', 'assignment')
        //     this.config[0].save()
        //     /**/
        // }
    }
});
