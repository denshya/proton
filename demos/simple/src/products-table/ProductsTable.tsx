import "./ProductsTable.scss"

import { Flow, FlowArray } from "@denshya/flow"



function FilterableProductTable(props: { products: Product[] }) {
  const searchValue = new Flow("")
  const inStockOnly = new Flow(false)

  return (
    <div>
      <SearchBar value={searchValue} inStockOnly={inStockOnly} />
      <ProductTable products={props.products} filterText={searchValue} inStockOnly={inStockOnly} />
    </div>
  )
}

function ProductCategoryRow(props: { category: string }) {
  return (
    <tr>
      <th colSpan={2}>{props.category}</th>
    </tr>
  )
}

function ProductRow(props: { product: Product }) {
  const name = props.product.stocked ? props.product.name : (
    <span style={{ color: "red" }}>{props.product.name}</span>
  )

  return (
    <tr>
      <td>{name}</td>
      <td>{props.product.price}</td>
    </tr>
  )
}

function ProductTable(props: { products: Product[], filterText: Flow<string>, inStockOnly: Flow<boolean> }) {
  let lastCategory: string | null = null
  const productsList = new FlowArray(props.products)

  Flow.compute(() => {
    lastCategory = null
    productsList.set(it => it)
  }, [props.filterText, props.inStockOnly])

  const rows = productsList.map(product => {
    if (product.name.toLowerCase().indexOf(props.filterText.get().toLowerCase()) === -1) return
    if (props.inStockOnly.get() && !product.stocked) return

    if (product.category !== lastCategory) {
      lastCategory = product.category
      return (
        <>
          <ProductCategoryRow category={product.category} />
          <ProductRow product={product} />
        </>
      )
    }

    lastCategory = product.category
    return <ProductRow product={product} />
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function SearchBar(props: { value: Flow<string>, inStockOnly: Flow<boolean> }) {
  return (
    <form>
      <input value={props.value} placeholder="Search..." />
      <label>
        <input
          type="checkbox"
          checked={props.inStockOnly}
          on={{ change: event => props.inStockOnly.set((event.currentTarget as HTMLInputElement).checked) }}
        />
        {" "}
        Only show products in stock
      </label>
    </form>
  )
}

const PRODUCTS: Product[] = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]

export default function ProductsTableApp() {
  return <FilterableProductTable products={PRODUCTS} />
}


interface Product {
  category: string
  price: string
  stocked: boolean
  name: string
}
