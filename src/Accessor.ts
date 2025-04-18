import { Subscriptable } from "./Observable"

interface Accessor<T> {
  get(): T
  set(value: T): void
}

export interface AccessorGet<T> { get(): T }
export interface AccessorSet<T> { set(value: T): void }

export type Accessible<T> = Partial<Accessor<T>>

/** @internal */
namespace Accessor {
  export function extractObservable<T>(object: any): Partial<Accessor<T> & Subscriptable<T>> | null {
    if (object instanceof Object === false) return null
    if (object.subscribe == null && object[Symbol.subscribe] == null && object.get == null && object.set == null) {
      return null
    }

    if (object.subscribe == null && Symbol.subscribe != null) {
      object.subscribe = object[Symbol.subscribe]
    }

    return object
  }
}

export default Accessor
