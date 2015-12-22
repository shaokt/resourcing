import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return $.getJSON('shao.json').then(
            function(response) {
                return response.employees.map(function (child) {
                    return child
                });
            }
        );
    },

    /*
    model() {
        let resources = [
            {
                name: "Shao T",
                assignment: {
                    tiles:"<span class='vacation' data-type='tile' data-scope='project' data-x='300' data-y='0' data-year='2015'></span>",
                    text:"<span class='vacation' data-type='tile' data-scope='text' data-x='300' data-y='0'>"
                },
                timeoff: {
                    tiles:"<span class='vacation' data-type='tile' data-scope='project' data-x='90' data-y='0' data-year='2015'></span>",
                    text:"<span class='vacation' data-type='tile' data-scope='text' data-x='90' data-y='0'>"
                }
            },
            {
                name: "Kristin T"
            }
        ];
        return resources;
    },
    /**/
    actions: {
        updateName(resource) {
            //console.log(this.response.get('Shao T'))
            //console.log(resource.timeoff)
            //console.log(this.response)
            //resource.save();
        },
        deleteTodo(todo) {
            todo.destroyRecord();
        }
    }
});
