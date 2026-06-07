const UNIT_ALIASES = new Map([
  ['ml', { family: 'volume', factor: 1, label: '100ml', basis: 100 }],
  ['millilitre', { family: 'volume', factor: 1, label: '100ml', basis: 100 }],
  ['millilitres', { family: 'volume', factor: 1, label: '100ml', basis: 100 }],
  ['milliliter', { family: 'volume', factor: 1, label: '100ml', basis: 100 }],
  ['milliliters', { family: 'volume', factor: 1, label: '100ml', basis: 100 }],
  ['l', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['lt', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['liter', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['liters', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['litre', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['litres', { family: 'volume', factor: 1000, label: '100ml', basis: 100 }],
  ['g', { family: 'weight', factor: 1, label: '100g', basis: 100 }],
  ['gram', { family: 'weight', factor: 1, label: '100g', basis: 100 }],
  ['grams', { family: 'weight', factor: 1, label: '100g', basis: 100 }],
  ['kg', { family: 'weight', factor: 1000, label: '100g', basis: 100 }],
  ['kilogram', { family: 'weight', factor: 1000, label: '100g', basis: 100 }],
  ['kilograms', { family: 'weight', factor: 1000, label: '100g', basis: 100 }],
  ['item', { family: 'count', factor: 1, label: 'item', basis: 1 }],
  ['items', { family: 'count', factor: 1, label: 'item', basis: 1 }],
  ['unit', { family: 'count', factor: 1, label: 'item', basis: 1 }],
  ['units', { family: 'count', factor: 1, label: 'item', basis: 1 }],
  ['pack', { family: 'count', factor: 1, label: 'item', basis: 1 }],
  ['packs', { family: 'count', factor: 1, label: 'item', basis: 1 }],
])

const MULTIPLY_PATTERN =
  /^\s*(?<count>\d+(?:\.\d+)?)\s*(?:x|\*)\s*(?<amount>\d+(?:\.\d+)?)\s*(?<unit>[a-zA-Z]+)\s*$/
const SIMPLE_PATTERN = /^\s*(?<amount>\d+(?:\.\d+)?)\s*(?<unit>[a-zA-Z]+)\s*$/

export function parseCost(value) {
  const normalized = String(value).replace(/[£,\s]/g, '')
  const cost = Number(normalized)

  if (!Number.isFinite(cost) || cost <= 0) {
    throw new Error('Enter a cost greater than £0.')
  }

  return cost
}

export function parseQuantity(value) {
  const text = String(value).trim().toLowerCase()
  const match = text.match(MULTIPLY_PATTERN) ?? text.match(SIMPLE_PATTERN)

  if (!match?.groups) {
    throw new Error('Enter a quantity like 4 x 330ml, 500ml, 250g, or 12 items.')
  }

  const count = Number(match.groups.count ?? 1)
  const amount = Number(match.groups.amount)
  const unitKey = match.groups.unit.toLowerCase()
  const unit = UNIT_ALIASES.get(unitKey)

  if (!unit) {
    throw new Error('Use ml, L, g, kg, items, or packs.')
  }

  const normalizedAmount = count * amount * unit.factor

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error('Enter a quantity greater than 0.')
  }

  return {
    family: unit.family,
    amount: normalizedAmount,
    label: unit.label,
    basis: unit.basis,
  }
}

export function calculateProductValue(product) {
  const cost = parseCost(product.cost)
  const quantity = parseQuantity(product.quantity)
  const unitPrice = (cost / quantity.amount) * quantity.basis

  return {
    label: product.label,
    cost,
    quantity,
    unitPrice,
  }
}

export function compareProducts(product1, product2) {
  const first = calculateProductValue({ ...product1, label: 'Product 1' })
  const second = calculateProductValue({ ...product2, label: 'Product 2' })

  if (first.quantity.family !== second.quantity.family) {
    throw new Error('These quantities use different unit types, so they cannot be compared.')
  }

  const [winner, loser] =
    first.unitPrice <= second.unitPrice ? [first, second] : [second, first]
  const savingPerBasis = Math.abs(first.unitPrice - second.unitPrice)
  const savingPercent = loser.unitPrice === 0 ? 0 : (savingPerBasis / loser.unitPrice) * 100

  return {
    first,
    second,
    winner,
    loser,
    unitLabel: first.quantity.label,
    savingPerBasis,
    savingPercent,
    isTie: savingPerBasis < 0.000001,
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 1,
  }).format(value)
}
