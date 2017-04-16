import RoadmapIndex from "./index";
import { storageFor } from 'ember-local-storage';

export default RoadmapIndex.extend({
    settings: storageFor("settings"),

    queryParams: {
        year: { refreshModel: true }
    },

    afterModel: function(){
        document.title = `Roadmap | Edit ${this.get('year')}`;
        this.set('constants.editAssignments', true);
    }
});
