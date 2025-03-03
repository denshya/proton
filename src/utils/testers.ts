import { AccessorGet } from "@/Accessor"
import Observable from "@/Observable"

export function isObservableGetter<T>(value: unknown): value is Observable<T> & AccessorGet<T> {
  // @ts-expect-error ok to check this way.
  if (value instanceof Object && value.get instanceof Function && value[Symbol.subscribe] instanceof Function) {
    return true
  }

  return false
}

export function isIterable<T>(value: unknown): value is Iterable<T> {
  // @ts-expect-error ok to check this way.
  return value instanceof Object && value[Symbol.iterator] instanceof Function
}

export function isAsyncIterable<T>(value: unknown): value is AsyncIterable<T> {
  // @ts-expect-error ok to check this way.
  return value instanceof Object && value[Symbol.asyncIterator] instanceof Function
}
