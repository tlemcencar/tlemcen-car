// Global safety patch for JSON.stringify to prevent circular structure errors
// (e.g. from DOM elements, React Fiber nodes, or third-party widgets)

if (typeof window !== 'undefined') {
  const _origStringify = JSON.stringify;

  JSON.stringify = function (value: any, replacer?: any, space?: any) {
    if (value && typeof value === 'object') {
      if (
        value.nodeType ||
        typeof value.tagName === 'string' ||
        (typeof Node !== 'undefined' && value instanceof Node)
      ) {
        return '{}';
      }
    }

    const seen = new WeakSet();

    function safeReplacer(k: string, v: any) {
      if (v && typeof v === 'object') {
        if (
          v.nodeType ||
          typeof v.tagName === 'string' ||
          (typeof Node !== 'undefined' && v instanceof Node) ||
          Object.keys(v).some(
            (key) => key.startsWith('__reactFiber') || key === 'stateNode'
          )
        ) {
          return undefined;
        }
        if (seen.has(v)) {
          return '[Circular]';
        }
        seen.add(v);
      }
      return v;
    }

    try {
      if (typeof replacer === 'function') {
        return _origStringify(
          value,
          function (this: any, k: string, v: any) {
            if (v && typeof v === 'object') {
              if (
                v.nodeType ||
                typeof v.tagName === 'string' ||
                (typeof Node !== 'undefined' && v instanceof Node) ||
                Object.keys(v).some(
                  (key) => key.startsWith('__reactFiber') || key === 'stateNode'
                )
              ) {
                return undefined;
              }
              if (seen.has(v)) return '[Circular]';
              seen.add(v);
            }
            return replacer.call(this, k, v);
          },
          space
        );
      } else if (Array.isArray(replacer)) {
        return _origStringify(value, replacer, space);
      }
      return _origStringify(value, safeReplacer, space);
    } catch {
      try {
        return _origStringify(value, safeReplacer, space);
      } catch {
        return '{}';
      }
    }
  };
}

export {};
