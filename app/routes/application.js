import Ember from 'ember';
import Resources from '../models/resources';

export default Ember.Route.extend({
    model() {
        return Ember.$.getJSON('shao.json').then((data)=> {
            return this.blah = data.employees.map(attrs => this.store.createRecord('resources', attrs));
        });
    },
    /*
    model() {
        return $.getJSON('shao.json').then(
            function(response) {
                return response.employees.map(function (child) {
                    return child
                });
            }
        );
    },
    */

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
