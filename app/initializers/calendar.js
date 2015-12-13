export default {
    name: 'cal',
    initialize: function(container, application) {
        application.inject('component:calendar-date', 'cal', 'component:calendar-widget');
    }
}
