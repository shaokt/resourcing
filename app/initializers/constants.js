export default {
    name: 'constants',
    initialize: function(container, application) {
        // constants
        application.inject('route', 'constants', 'service:constants');
        application.inject('controller', 'constants', 'service:constants');
        application.inject('component', 'constants', 'service:constants');

        // router
        application.inject('controller', 'router', 'router:main');
        application.inject('component', 'router', 'router:main');
    }
};
