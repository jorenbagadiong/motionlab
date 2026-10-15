/**
 * A visual preference stored in localStorage and mirrored as a data attribute
 * on <html> (e.g. data-theme="light"). The fallback value is never stored and
 * leaves the attribute unset, so CSS defaults apply.
 */
export type Preference<T extends string> = {
  values: readonly T[]
  fallback: T
  storageKey: string
  /** Dataset key, e.g. "theme" for data-theme. */
  attribute: string
  read: () => T
  apply: (value: T) => void
  subscribe: (onChange: () => void) => () => void
}

export function createPreference<T extends string>(options: {
  values: readonly T[]
  fallback: T
  storageKey: string
  attribute: string
}): Preference<T> {
  const { values, fallback, storageKey, attribute } = options
  const changeEvent = `motionlab-${attribute}-change`
  const isStored = (value: unknown): value is T =>
    value !== fallback && (values as readonly unknown[]).includes(value)

  function setAttribute(value: T) {
    const root = document.documentElement
    if (isStored(value)) root.dataset[attribute] = value
    else delete root.dataset[attribute]
  }

  function read(): T {
    try {
      const stored = localStorage.getItem(storageKey)
      return isStored(stored) ? stored : fallback
    } catch {
      // Storage can be unavailable (privacy modes); use the default.
      return fallback
    }
  }

  function apply(value: T) {
    setAttribute(value)
    try {
      if (isStored(value)) localStorage.setItem(storageKey, value)
      else localStorage.removeItem(storageKey)
    } catch {
      // The choice still applies for this page view.
    }
    window.dispatchEvent(new Event(changeEvent))
  }

  /** Notifies on changes from this tab (custom event) and other tabs (storage event). */
  function subscribe(onChange: () => void) {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return
      setAttribute(read())
      onChange()
    }
    window.addEventListener(changeEvent, onChange)
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener(changeEvent, onChange)
      window.removeEventListener("storage", onStorage)
    }
  }

  return { values, fallback, storageKey, attribute, read, apply, subscribe }
}

/**
 * Inline script for <head>: applies stored choices before first paint, so the
 * page never flashes the defaults. Only allow-listed values are applied; it
 * must not throw.
 */
export function preferenceInitScript(
  preferences: Pick<Preference<string>, "values" | "fallback" | "storageKey" | "attribute">[],
) {
  const entries = preferences.map(({ storageKey, attribute, values, fallback }) => [
    storageKey,
    attribute,
    values.filter((value) => value !== fallback),
  ])
  return `(function(){var p=${JSON.stringify(entries)};for(var i=0;i<p.length;i++){try{var v=localStorage.getItem(p[i][0]);if(p[i][2].indexOf(v)>-1)document.documentElement.dataset[p[i][1]]=v}catch(e){}}})()`
}
