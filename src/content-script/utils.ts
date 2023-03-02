export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function select<TElement extends Element>(selector: string): TElement {
  const element = document.querySelector<TElement>(selector)
  if (!element) {
    throw new Error(`Could not find element with selector: ${selector}`)
  }

  return element
}
