import Ember from 'ember';

// if in regular view, show all assignments
// if viewing people assigned, only render the current assignment
export function assignmentViewPeople(params/*, hash*/) {
    return params[0] === 'roadmap' ? true :
        params[1] === params[2] ? true :
        false;
}

export default Ember.Helper.helper(assignmentViewPeople);
