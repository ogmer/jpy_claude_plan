import type { BillingCycle } from '../data/plans'
import { CYCLE_LABEL } from '../lib/pricing'

interface BillingToggleProps {
  value: BillingCycle
  onChange: (cycle: BillingCycle) => void
}

const CYCLES: BillingCycle[] = ['monthly', 'annual']

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <fieldset>
      <legend className="sr-only">支払い方法</legend>
      <div className="inline-flex rounded-full bg-stone-200/80 p-1 dark:bg-stone-800">
        {CYCLES.map((cycle) => (
          <label
            key={cycle}
            className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-stone-600 transition-colors select-none hover:text-stone-900 has-checked:bg-white has-checked:text-stone-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-orange-700 dark:text-stone-400 dark:hover:text-stone-100 dark:has-checked:bg-stone-600 dark:has-checked:text-white"
          >
            <input
              type="radio"
              name="billing"
              value={cycle}
              checked={value === cycle}
              onChange={() => onChange(cycle)}
              className="sr-only"
            />
            {CYCLE_LABEL[cycle]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
