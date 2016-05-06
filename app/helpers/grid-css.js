import Ember from 'ember';

// prints out the crid for css - not called unless grid needs to change
export function gridCss(params/*, hash*/) {
    var gridcss = "";
    for(var gx = 0; gx <= 9315; gx+=15){ gridcss += '[data-x="' + gx +'"] { left:' + gx + 'px; }' + "\n"; }
    return gridcss;
}

export default Ember.Helper.helper(gridCss);
