import { inventory } from '@/data/loadScan'

/** Inventory counts from the scan's discovered entity lists. Expand into a real
 *  tree (per-entity rows with file:line) when wiring the full inventory. */
export function InventoryTree() {
  return (
    <ul className="text-sm">
      {inventory.map((g) => (
        <li key={g.label} className="flex justify-between border-b py-2 last:border-0">
          <span>{g.label}</span>
          <span className="text-fg-muted">{g.n}</span>
        </li>
      ))}
    </ul>
  )
}
