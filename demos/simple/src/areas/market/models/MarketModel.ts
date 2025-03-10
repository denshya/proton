import { Flow } from "@denshya/flow"
import { MarketProduct } from "../types"

class MarketModel {
  /** User's products cart [id => amount]. */
  readonly cart = new Flow<Map<MarketProduct["id"], number>>(new Map)
  /** User's favourite products by id. */
  readonly liked = new Flow<Set<MarketProduct["id"]>>(new Set)

  readonly filters = {
    search: new Flow(""),
  } as const
  readonly sorting = {}
}

export default MarketModel
