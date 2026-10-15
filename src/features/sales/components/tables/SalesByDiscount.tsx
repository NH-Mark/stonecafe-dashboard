
"use client";

type SalesByDiscountItem = {
  discount_id: number | null;
  discount_name: string;
  qty: number;
  value: number;
};

type SalesByDiscountProps = {
  data: SalesByDiscountItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-QA", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-QA", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function SalesByDiscount({
  data = [],
}: SalesByDiscountProps) {
  const totalQty = data.reduce((sum, item) => sum + (item.qty || 0), 0);
  const totalValue = data.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Sales by Discount
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Discount usage and value
          </p>
        </div>

        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {data.length} discounts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="py-2 pr-3 text-left font-medium">Discount</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="py-2 pl-3 text-right font-medium">Value</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={`${item.discount_id ?? "unknown"}-${index}`}
                  className="text-gray-700 dark:text-gray-200"
                >
                  <td className="max-w-[180px] truncate py-2 pr-3">
                    {item.discount_name || "Unnamed discount"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatNumber(item.qty)}
                  </td>
                  <td className="whitespace-nowrap py-2 pl-3 text-right font-medium tabular-nums">
                    {formatCurrency(item.value)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-xs text-gray-500"
                >
                  No discount data available
                </td>
              </tr>
            )}
          </tbody>

          {data.length > 0 && (
            <tfoot>
              <tr className="border-t border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                <td className="py-2 pr-3">Total</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatNumber(totalQty)}
                </td>
                <td className="whitespace-nowrap py-2 pl-3 text-right tabular-nums">
                  {formatCurrency(totalValue)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}