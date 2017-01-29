import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignment-phase-colours-sector', 'Integration | Component | assignment phase colours sector', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{assignment-phase-colours-sector}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#assignment-phase-colours-sector}}
      template block text
    {{/assignment-phase-colours-sector}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
