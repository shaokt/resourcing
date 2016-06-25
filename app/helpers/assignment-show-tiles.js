import Ember from 'ember';

// if it is a weeklyCalendar or if the dataView is timeaway, then show the tiles in the header
export function assignmentShowTiles(params/*, hash*/) {
    return (
        params[0] && // weeklyCalendar
        params[1].dataView === '' || 'assignment') ||
        params[1].dataView === 'timeaway' ? true : false;
}

export default Ember.Helper.helper(assignmentShowTiles);
