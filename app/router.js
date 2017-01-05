import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('roadmap', function() {
    this.route('edit');
  });
  this.route('home');
});

export default Router;
