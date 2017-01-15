import Ember from 'ember';

// prints out the grid for css - not called unless grid needs to change
export function gridCss(){
    var gx;
    var gridcss = "";
    // takes care of the phases left position when viewing in daily calendar
    var gridAssignmentInTimeView = `[data-view="timeaway"][data-route="roadmap.index"] [data-view="roadmap"] :not(.dateLine){`;

    // takes care of the phases width in weekly view
    var gridPhasesWidth = `[data-route="roadmap.index"] [data-type="assignment"] [data-view="roadmap"] .phases {\n`;

    // takes care of the phases width in weekly view
    var gridPhasesWidthDaily = `[data-route="roadmap.index"][data-view="timeaway"] [data-type="assignment"] [data-view="roadmap"] .phases {\n`;

    for(gx = 0; gx <= 9315; gx+=15){ gridcss += '[data-x="' + gx +'"] { left:' + gx + 'px; }' + "\n"; }

    for(gx = 0; gx <= 9315; gx+=15){ gridAssignmentInTimeView += '[data-x="' + gx +'"] { left:' + gx*5 + 'px; }' + "\n"; }
    gridAssignmentInTimeView+= "}";

    for(gx = 0; gx <= 9315; gx+=15) { gridPhasesWidth += `[data-width="${gx}"]{width:${gx}px;}`; }
    gridPhasesWidth += "\n}";

    for(gx = 0; gx <= 9315; gx+=15) { gridPhasesWidthDaily += `[data-width="${gx}"]{width:${gx*5}px;}`; }
    gridPhasesWidthDaily += "\n}";

    return gridPhasesWidthDaily;
}

export default Ember.Helper.helper(gridCss);
