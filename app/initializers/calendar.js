export default {
    name: 'cal',
    initialize: function(container, application) {
        application.inject('component:calendar-date', 'cal', 'component:calendar-widget');
        application.inject('component:header-section', 'cal', 'component:calendar-widget');
        application.inject('component:calendar-widget', 'holidays', 'component:calendar-holidays');
    }
};
