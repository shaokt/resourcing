import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-holiday-tiles', 'Integration | Component | calendar holiday tiles', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{calendar-holiday-tiles}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#calendar-holiday-tiles}}
      template block text
    {{/calendar-holiday-tiles}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
