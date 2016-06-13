export default {
    name: 'constants',
    initialize: function(container, application) {
        application.inject('route', 'constants', 'service:constants');
        application.inject('controller', 'constants', 'service:constants');
        application.inject('component', 'constants', 'service:constants');
        application.inject('controller', 'router', 'router:main');
    }
};
