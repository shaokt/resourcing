import Ember from 'ember';

// checks if the tile being rendered matches the tile saved in config
export function configDefaultTile(params) {
    return params[0] == params[1]
}

export default Ember.Helper.helper(configDefaultTile);
