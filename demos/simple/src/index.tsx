import "./polyfills"
import "./error-overlay"

import { Proton, WebInflator } from "@denshya/proton"

import App from "./App"
import applyCustomAttributes from "./custom-attributes"

/**
 * When faced, it is instructed to unwrap this fragment and use its target node as original.
 */
class WebTempFragment extends DocumentFragment {
  declare target: Node
}
class WebComponentPlaceholder extends Comment {
  /**
   * @returns actual node of `WebComponentPlaceholder` if `item` is of its instance.
   * @returns `item` itself if `item` is instance of `Node`.
   * @returns null if `item` is NOT instance of `Node`.
   */
  static actualOf(item: unknown): WebComponentPlaceholder | Node | null {
    if (item instanceof WebTempFragment) return WebComponentPlaceholder.actualOf(item.target)
    if (item instanceof WebComponentPlaceholder) return item.actual
    if (item instanceof Node) return item

    return null
  }

  /**
   * The node that is supposed to be being used at current conditions.
   */
  get actual(): Node | null {
    const shellView = this.shell.getView()

    if (shellView == null) return this
    if (shellView === this) return this
    if (shellView instanceof Node === false) return null

    return WebComponentPlaceholder.actualOf(shellView)
  }

  constructor(public shell: ProtonShell, shellConstructor: Function) {
    super(shellConstructor.name)
  }

  protected safeActualParentElement() {
    const actual = this.actual
    if (actual === this) return null

    return actual?.parentElement
  }

  override get parentElement() {
    const element = super.parentElement ?? this.safeActualParentElement()
    if (element == null) {
      const shellView = this.shell.getView()
      if (shellView === this) return null
      if (shellView instanceof Node === false) return null

      return shellView.parentElement
    }

    return element
  }
}

class Gg extends WebInflator {
  protected clone() {
    const clone = new Gg
    clone.flags = { ...this.flags }
    clone.jsxAttributes = new Map(this.jsxAttributes)
    return clone
  }
  override inflateComponent(factory: Function, props?: any) {
    const shell = new Proton.Shell(this, this.shell)

    const componentPlaceholder = new WebComponentPlaceholder(shell, factory)
    const componentWrapper = new WebTempFragment
    componentWrapper.append(componentPlaceholder)
    componentWrapper.target = componentPlaceholder
    componentWrapper.fixedNodes = [componentPlaceholder]

    const asd = shell.getView()
    if (asd != null) componentWrapper.append(asd)

    let currentView: Node = componentPlaceholder
    let lastAnimationFrame = -1

    const replace = (view: unknown) => {
      let nextView = view
      if (view === null) {
        nextView = componentPlaceholder
        // @ts-expect-error by design.
        nextView.replacedWith = null
      }
      if (nextView instanceof Node === false) return

      let actualNextView = nextView
      if (actualNextView.toBeReplacedWith != null) {
        const toBeReplacedWith = actualNextView.toBeReplacedWith

        actualNextView.toBeReplacedWith = null
        actualNextView = toBeReplacedWith
      }

      currentView = resolveReplacement(currentView)
      currentView.toBeReplacedWith = actualNextView

      if (currentView.replaceWith instanceof Function) {
        if (currentView.parentNode != null) {
          if (actualNextView instanceof DocumentFragment && actualNextView.childNodes.length === 0) {
            actualNextView.replaceChildren(...actualNextView.fixedNodes)
          }

          currentView.replaceWith(actualNextView)
          currentView.toBeReplacedWith = null
        }

        if (view !== null) {
          // @ts-expect-error by design.
          currentView.replacedWith = nextView
        } else {
          // @ts-expect-error by design.
          currentView.replacedWith = null
        }
        // @ts-expect-error by design.
        nextView.replacedWith = null
        // @ts-expect-error by design.
        actualNextView.replacedWith = null

        currentView = nextView

        return
      }

      if (currentView instanceof DocumentFragment) {
        // @ts-expect-error by design.
        const fixed = currentView.fixedNodes as Node[]
        const fixedNodes = fixed.map(node => WebComponentPlaceholder.actualOf(node) ?? node)

        const anchor = fixedNodes[0]

        if (actualNextView instanceof DocumentFragment) {
          // @ts-expect-error by design.
          const firstFixed = actualNextView.fixedNodes[0]
          const actualAnchor = WebComponentPlaceholder.actualOf(firstFixed) ?? firstFixed

          if (actualAnchor === anchor) return
        }

        if (anchor.parentElement != null) {
          anchor.parentElement.replaceChild(actualNextView, anchor)
          currentView.toBeReplacedWith = null
        }
        currentView.replaceChildren(...fixedNodes)

        if (view !== null) {
          // @ts-expect-error by design.
          currentView.replacedWith = nextView
        } else {
          // @ts-expect-error by design.
          currentView.replacedWith = null
        }
        // @ts-expect-error by design.
        nextView.replacedWith = null
        // @ts-expect-error by design.
        actualNextView.replacedWith = null

        currentView = nextView

        if (anchor instanceof WebComponentPlaceholder) {
          // @ts-expect-error no another way.
          anchor.shell.events.dispatch("unmount")
        }

        return
      }
    }

    shell.on("view").subscribe(view => {
      cancelAnimationFrame(lastAnimationFrame)
      lastAnimationFrame = requestAnimationFrame(() => replace(view))
    })

    Proton.Shell.evaluate(shell, factory, props)

    return componentWrapper
  }
}


const inflator = new WebInflator
inflator.flags.debug = true
applyCustomAttributes(inflator)


const inflated = inflator.inflate(<App />)
document.getElementById("root")!.replaceChildren(inflated)


function resolveReplacement(value: any): any {
  const seen = new Set()
  while (value?.replacedWith) {
    if (seen.has(value)) return value
    seen.add(value)
    value = value.replacedWith
  }
  return value
}
