import Ember from 'ember';
import ResourceInfoComponent from "./resource-info";

export default ResourceInfoComponent.extend({
    actions: {
        select() {
            var obj;
            // if browser thinks the target is the span tag instead of the anchor, return the parent
            if($(event.target)[0].tagName.match(/span/gi)){ obj = $(event.target.parentNode); }
            else { obj = $(event.target) }
            this.set('assignment.isActive', obj.hasClass('empty') ? false : true)
            this.constants.webcel.setTile(obj);
        }
    }
});
