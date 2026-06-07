import assert from 'node:assert/strict'
import { compareProducts, parseQuantity } from './valueCalculator.js'

const quantityCases = [
  ['4 x 330ml', 1320, 'volume'],
  ['4x330 ml', 1320, 'volume'],
  ['1.5L', 1500, 'volume'],
  ['500 ml', 500, 'volume'],
  ['250g', 250, 'weight'],
  ['2 kg', 2000, 'weight'],
  ['12 items', 12, 'count'],
]

for (const [input, amount, family] of quantityCases) {
  const parsed = parseQuantity(input)
  assert.equal(parsed.amount, amount, input)
  assert.equal(parsed.family, family, input)
}

const dash = compareProducts(
  { name: 'Waitrose Dash', cost: '4.75', quantity: '4 x 330ml' },
  { name: 'M&S Dash', cost: '1.76', quantity: '500ml' },
)

assert.equal(dash.winner.name, 'M&S Dash')
assert.equal(dash.unitLabel, '100ml')
assert.equal(Math.round(dash.first.unitPrice * 1000), 360)
assert.equal(Math.round(dash.second.unitPrice * 1000), 352)

assert.throws(
  () =>
    compareProducts(
      { name: 'Drink', cost: '2', quantity: '500ml' },
      { name: 'Snack', cost: '2', quantity: '250g' },
    ),
  /different unit types/,
)

assert.throws(() => parseQuantity(''), /quantity/)
assert.throws(() => parseQuantity('0ml'), /greater than 0/)

console.log('value calculator tests passed')
