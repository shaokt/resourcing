import Ember from 'ember';

// prints out the grid for css - not called unless grid needs to change
export function gridCss(){
    var gx;
    var gridcss = "";
    var gridAssignmentInTimeView = "";
    for(gx = 0; gx <= 9315; gx+=15){ gridcss += '[data-x="' + gx +'"] { left:' + gx + 'px; }' + "\n"; }

    for(gx = 0; gx <= 9315; gx+=15){ gridAssignmentInTimeView += '[data-x="' + gx +'"] { left:' + gx*5 + 'px; }' + "\n"; }
    return gridAssignmentInTimeView;
}

export default Ember.Helper.helper(gridCss);
