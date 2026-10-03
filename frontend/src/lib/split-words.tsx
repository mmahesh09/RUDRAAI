import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

/**
 * Splits every text node in `node` into masked word spans (`.sw > span`), keeping wrapper
 * elements (accent spans etc.) intact. Each word carries `--i` so CSS can stagger it.
 * Pure — safe in server and client components.
 */
export function splitWords(node: ReactNode, counter = { n: 0 }): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, k) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return " ";
      return (
        <span key={k} className="sw">
          <span style={{ "--i": counter.n++ } as CSSProperties}>{part}</span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return Children.map(node, (child) => splitWords(child, counter));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.props.children === undefined) return el;
    return cloneElement(el, undefined, splitWords(el.props.children, counter));
  }
  return node;
}
