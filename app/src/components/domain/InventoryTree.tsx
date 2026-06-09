import { inventory as fleetInventory } from '@/data/loadScan'

/** Inventory counts from discovered entity lists. Defaults to the fleet-wide
 *  totals; pass `inventory` to scope it to a single scan. */
export function InventoryTree({ inventory = fleetInventory }: { inventory?: Array<{ label: string; n: number }> }) {
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
