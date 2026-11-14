import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { ProductItem } from "../shopConfig";
import { SHOP_CONFIG } from "../shopConfig";
import { buildWhatsAppUrl, formatNaira } from "../utils/formatters";
import { FabricImage } from "./FabricImage";

export interface BagItem {
  product: ProductItem;
  color: string;
  quantity: number;
}

interface OrderBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onUpdateQuantity: (productId: string, color: string, delta: number) => void;
  onRemoveItem: (productId: string, color: string) => void;
  onClearBag: () => void;
}

const POPULAR_STATES = [
  "Kano (Shop Pickup / Local Dispatch)",
  "Abuja (FCT)",
  "Lagos",
  "Kaduna",
  "Katsina",
  "Sokoto",
  "Jos (Plateau)",
  "Port Harcourt (Rivers)",
  "Other State (Specify in Chat)",
];

export function OrderBagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: OrderBagDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"waybill" | "pickup">("waybill");
  const [destinationState, setDestinationState] = useState("Abuja (FCT)");
  const [copied, setCopied] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const buildOrderMessage = () => {
    const lines = [
      `Hello ${SHOP_CONFIG.name}, I would like to place an order:`,
      ``,
      ...items.map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.color}) — Qty: ${item.quantity} × ${formatNaira(item.product.price)} (${item.product.unit}) = ${formatNaira(item.product.price * item.quantity)}`
      ),
      ``,
      `Estimated Fabric Total: ${formatNaira(subtotal)}`,
      `Delivery Option: ${
        deliveryMethod === "pickup"
          ? `Shop Pickup (${SHOP_CONFIG.address})`
          : `Nationwide Waybill to ${destinationState}`
      }`,
    ];

    if (customerName.trim()) {
      lines.push(`Customer Name: ${customerName.trim()}`);
    }
    if (customerPhone.trim()) {
      lines.push(`Phone Number: ${customerPhone.trim()}`);
    }
    lines.push(``, `Please share payment details and dispatch timeline.`);
    return lines.join("\n");
  };

  const orderMessage = buildOrderMessage();
  const whatsappUrl = buildWhatsAppUrl(SHOP_CONFIG.whatsappNumber, orderMessage);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleRecordSubmission = () => {
    const refCode = `UA-${String(Date.now()).slice(-4)}`;
    setSubmittedRef(refCode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#171614]/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-bag-title"
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-[#E5DFD6] bg-[#FAF8F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DFD6] px-6 py-4">
          <div>
            <h2
              id="order-bag-title"
              className="font-display text-xl font-semibold text-[#171614]"
            >
              Order Bag
            </h2>
            <p className="text-xs text-[#6B655E] tabular-nums">
              {totalUnits === 0
                ? "No fabrics selected yet"
                : `${totalUnits} ${totalUnits === 1 ? "item" : "items"} selected`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order bag"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5DFD6] bg-white text-[#171614] transition-colors hover:bg-[#F3EFEA] focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {submittedRef && items.length > 0 && (
            <div className="mb-5 rounded-lg border border-[#C9D6CE] bg-[#F1F6F3] p-4 text-sm text-[#1E3A2F]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">Order Reference #{submittedRef} Ready</span>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="text-xs underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#335243]">
                Your itemized order has been prepared for WhatsApp dispatch. You can also copy the order text below or adjust items anytime.
              </p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5DFD6] bg-[#F3EFEA] text-[#6B655E]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-[#171614]">
                Your order bag is empty
              </h3>
              <p className="mt-1.5 max-w-[260px] text-sm text-[#6B655E]">
                Browse Shadda, Atampa, Swiss Voile, or Cashmere fabrics to build your retail or wholesale order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 min-h-[42px] rounded-lg bg-[#171614] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2F2D29]"
              >
                Explore Fabrics
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items */}
              <ul className="divide-y divide-[#E5DFD6]">
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.color}`}
                    className="flex gap-4 py-4 first:pt-0"
                  >
                    <FabricImage
                      src={item.product.image}
                      alt={item.product.name}
                      swatchColor={item.product.swatchColor}
                      className="h-20 w-24 shrink-0 rounded-md border border-[#E5DFD6]"
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#171614]">
                            {item.product.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#6B655E]">
                            Shade: {item.color} · {item.product.unit}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.color)}
                          aria-label={`Remove ${item.product.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#6B655E] transition-colors hover:bg-[#F3EFEA] hover:text-[#991B1B]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded border border-[#D8D0C5] bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.color, -1)
                            }
                            aria-label="Decrease item quantity"
                            className="flex h-8 w-8 items-center justify-center text-[#171614] hover:bg-[#F3EFEA]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.color, 1)
                            }
                            aria-label="Increase item quantity"
                            className="flex h-8 w-8 items-center justify-center text-[#171614] hover:bg-[#F3EFEA]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-medium text-[#171614] tabular-nums">
                          {formatNaira(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Delivery & Customer Details */}
              <div className="space-y-4 border-t border-[#E5DFD6] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B655E]">
                    Delivery Preference
                  </span>
                  <button
                    type="button"
                    onClick={onClearBag}
                    className="text-xs font-medium text-[#6B655E] underline underline-offset-2 hover:text-[#171614]"
                  >
                    Clear Bag
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#EDE7DE] p-1">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("waybill")}
                    className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      deliveryMethod === "waybill"
                        ? "bg-white text-[#171614] shadow-sm"
                        : "text-[#5C564F] hover:text-[#171614]"
                    }`}
                  >
                    Nationwide Waybill
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      deliveryMethod === "pickup"
                        ? "bg-white text-[#171614] shadow-sm"
                        : "text-[#5C564F] hover:text-[#171614]"
                    }`}
                  >
                    Kano Shop Pickup
                  </button>
                </div>

                {deliveryMethod === "waybill" ? (
                  <div>
                    <label
                      htmlFor="waybill-state"
                      className="block text-xs font-medium text-[#4A453F]"
                    >
                      Destination State / City
                    </label>
                    <select
                      id="waybill-state"
                      value={destinationState}
                      onChange={(e) => setDestinationState(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#D8D0C5] bg-white px-3 py-2 text-sm text-[#171614] focus:border-[#1E3A5F] focus:outline-none"
                    >
                      {POPULAR_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="rounded-lg border border-[#E5DFD6] bg-white p-3 text-xs leading-relaxed text-[#4A453F]">
                    Pickup Location: <strong className="font-semibold text-[#171614]">{SHOP_CONFIG.address}</strong>
                    <br />
                    Hours: {SHOP_CONFIG.hours}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-xs font-medium text-[#4A453F]"
                    >
                      Your Name (Optional)
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g., Sadiq Ibrahim"
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#D8D0C5] bg-white px-3 py-2 text-sm text-[#171614] placeholder:text-[#9A938A] focus:border-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="block text-xs font-medium text-[#4A453F]"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g., 0803 123 4567"
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[#D8D0C5] bg-white px-3 py-2 text-sm text-[#171614] placeholder:text-[#9A938A] focus:border-[#1E3A5F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#E5DFD6] bg-white px-6 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-[#4A453F]">
                Estimated Fabric Subtotal
              </span>
              <span className="font-mono text-xl font-semibold text-[#171614] tabular-nums">
                {formatNaira(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B655E]">
              Waybill park fee is confirmed in WhatsApp based on destination & weight.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRecordSubmission}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162C49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Order via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-[#D8D0C5] bg-[#FAF8F5] px-4 py-2 text-xs font-medium text-[#171614] transition-colors hover:bg-[#F3EFEA]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#0F5132]" />
                    <span>Order Text Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#6B655E]" />
                    <span>Copy Order Summary Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
