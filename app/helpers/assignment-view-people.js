import Ember from 'ember';

// if in regular view, show all assignments
// if viewing people assigned, only render the current assignment
export function assignmentViewPeople(params/*, hash*/) {
    return params[0] === 'roadmap' ? true :
        params[0] === 'timeaway' && params[1] === 'home' ? true : // support for when viewing assignments from out of office view
        params[2] === params[3] ? true :
        false;
}

export default Ember.Helper.helper(assignmentViewPeople);
