import Ember from 'ember';

export default Ember.Route.extend({
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
            },
            {
                name: "Julie N"
            }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
            ,{ name: "test" }
        ];
        return resources;
    },

    actions: {
        /*
        createTodo(newTitle) {
           this.store.createRecord('todo', {
               title: newTitle,
               complete: false
           }).save();
        },
        */
        updateName(todo) {
            resources.save();
        },
        deleteTodo(todo) {
            todo.destroyRecord();
        }
    }
});
