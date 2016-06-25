import Ember from 'ember';

// prints out the crid for css - not called unless grid needs to change
export function gridCss(params/*, hash*/) {
    var gridcss = "";
    var gridAssignmentInTimeView = "";
    for(var gx = 0; gx <= 9315; gx+=15){ gridcss += '[data-x="' + gx +'"] { left:' + gx + 'px; }' + "\n"; }

    for(var gx = 0; gx <= 9315; gx+=15){ gridAssignmentInTimeView += '[data-x="' + gx +'"] { left:' + gx*5 + 'px; }' + "\n"; }
    return gridAssignmentInTimeView;
}

export default Ember.Helper.helper(gridCss);
