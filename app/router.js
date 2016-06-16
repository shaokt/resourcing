import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('assignments', function() {
    this.route('edit');
  });
  this.route('home');
  this.route('profile');
});

export default Router;
