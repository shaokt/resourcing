import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignment-phase-customization', 'Integration | Component | assignment phase customization', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{assignment-phase-customization}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#assignment-phase-customization}}
      template block text
    {{/assignment-phase-customization}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
