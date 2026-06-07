import { useMemo, useState } from 'react'
import './App.css'
import {
  compareProducts,
  formatCurrency,
  formatPercent,
} from './lib/valueCalculator.js'

/* global __BUILD_ID__ */
const buildId = import.meta.env.VITE_BUILD_ID || __BUILD_ID__

const initialProducts = {
  product1: {
    name: 'Waitrose Dash',
    cost: '4.75',
    quantity: '4 x 330ml',
  },
  product2: {
    name: 'M&S Dash',
    cost: '1.76',
    quantity: '500ml',
  },
}

function Field({ label, value, onChange, inputMode, placeholder, autoComplete = 'off' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  )
}

function ProductForm({ title, product, onChange }) {
  const update = (key, value) => onChange({ ...product, [key]: value })

  return (
    <section className="product-panel" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`}>{title}</h2>
      <Field
        label="Product"
        value={product.name}
        onChange={(value) => update('name', value)}
        placeholder="Dash fruit drink"
      />
      <Field
        label="Cost (£)"
        value={product.cost}
        onChange={(value) => update('cost', value)}
        inputMode="decimal"
        placeholder="4.75"
      />
      <Field
        label="Quantity / weight"
        value={product.quantity}
        onChange={(value) => update('quantity', value)}
        placeholder="4 x 330ml"
      />
    </section>
  )
}

function Result({ result }) {
  if (!result) {
    return (
      <section className="result-panel idle" aria-live="polite">
        <p>Enter two products and tap calculate to compare value.</p>
      </section>
    )
  }

  if (result.type === 'error') {
    return (
      <section className="result-panel error" aria-live="polite">
        <p>{result.message}</p>
      </section>
    )
  }

  const { comparison } = result
  const headline = comparison.isTie
    ? 'Both products are the same value'
    : `${comparison.winner.name} is better value`

  return (
    <section className="result-panel success" aria-live="polite">
      <p className="winner">{headline}</p>
      {!comparison.isTie && (
        <p className="saving">
          Saves {formatCurrency(comparison.savingPerBasis)} per {comparison.unitLabel} (
          {formatPercent(comparison.savingPercent)}%)
        </p>
      )}
      <div className="result-grid">
        <div>
          <span>{comparison.first.name}</span>
          <strong>
            {formatCurrency(comparison.first.unitPrice)} / {comparison.unitLabel}
          </strong>
          <small>Total {formatCurrency(comparison.first.cost)}</small>
        </div>
        <div>
          <span>{comparison.second.name}</span>
          <strong>
            {formatCurrency(comparison.second.unitPrice)} / {comparison.unitLabel}
          </strong>
          <small>Total {formatCurrency(comparison.second.cost)}</small>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [calculation, setCalculation] = useState(null)

  const canReset = useMemo(
    () => JSON.stringify(products) !== JSON.stringify(initialProducts) || calculation,
    [products, calculation],
  )

  const updateProduct = (key, product) => {
    setProducts((current) => ({ ...current, [key]: product }))
  }

  const calculate = (event) => {
    event.preventDefault()

    try {
      setCalculation({
        type: 'success',
        comparison: compareProducts(products.product1, products.product2),
      })
    } catch (error) {
      setCalculation({ type: 'error', message: error.message })
    }
  }

  const reset = () => {
    setProducts(initialProducts)
    setCalculation(null)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-label">Phone value calculator</p>
          <h1>Compari Price</h1>
        </div>
        <span className="build-label">build {buildId}</span>
      </header>

      <form className="calculator" onSubmit={calculate}>
        <ProductForm
          title="Product 1"
          product={products.product1}
          onChange={(product) => updateProduct('product1', product)}
        />
        <ProductForm
          title="Product 2"
          product={products.product2}
          onChange={(product) => updateProduct('product2', product)}
        />

        <div className="actions">
          <button className="calculate-button" type="submit">
            Calculate Value
          </button>
          <button className="reset-button" type="button" onClick={reset} disabled={!canReset}>
            Reset
          </button>
        </div>
      </form>

      <Result result={calculation} />

      <p className="hint">Enter the final discounted price if a staff discount or offer applies.</p>
    </main>
  )
}

export default App
