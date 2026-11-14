import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, MessageCircle, X, Check } from "lucide-react";
import type { ProductItem } from "../shopConfig";
import { SHOP_CONFIG } from "../shopConfig";
import {
  buildSingleProductWhatsAppMessage,
  buildWhatsAppUrl,
  formatNaira,
  parseColorOptions,
} from "../utils/formatters";
import { FabricImage } from "./FabricImage";

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToBag: (product: ProductItem, color: string, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToBag,
}: ProductDetailModalProps) {
  const colorOptions = product ? parseColorOptions(product.colors) : [];
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      const options = parseColorOptions(product.colors);
      setSelectedColor(options[0] || "Assorted");
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeColor = selectedColor || colorOptions[0] || "Assorted";
  const whatsappMessage = buildSingleProductWhatsAppMessage(
    SHOP_CONFIG.name,
    product,
    activeColor,
    quantity
  );
  const whatsappUrl = buildWhatsAppUrl(SHOP_CONFIG.whatsappNumber, whatsappMessage);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToBag(product, activeColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-[#E5DFD6] bg-[#FAF8F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close fabric details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5DFD6] bg-[#FAF8F5]/95 text-[#171614] transition-colors hover:bg-[#F3EFEA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#F3EFEA]">
            <FabricImage
              src={product.image}
              alt={product.name}
              swatchColor={product.swatchColor}
              title={product.name}
              className="aspect-[4/3] h-full w-full md:aspect-auto md:min-h-[380px]"
            />
          </div>

          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B655E]">
                <span className="uppercase tracking-wider">{product.category}</span>
                {product.badge && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#8C6239]">{product.badge}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>

              <h2
                id="modal-product-title"
                className="mt-2 font-display text-2xl font-semibold leading-snug text-[#171614]"
              >
                {product.name}
              </h2>

              <div className="mt-4 flex items-baseline gap-2.5 border-b border-[#E5DFD6] pb-4">
                <span className="font-mono text-2xl font-medium text-[#171614] tabular-nums">
                  {formatNaira(product.price)}
                </span>
                <span className="text-sm text-[#6B655E]">{product.unit}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#4A453F]">
                {product.description}
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B655E]">
                  Available Shades
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {colorOptions.map((color) => {
                    const isSelected = activeColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F] ${
                          isSelected
                            ? "border-[#171614] bg-[#171614] text-[#FAF8F5]"
                            : "border-[#D8D0C5] bg-white text-[#171614] hover:border-[#8C6239]"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B655E]">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-md border border-[#D8D0C5] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center text-[#171614] transition-colors hover:bg-[#F3EFEA] focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-medium text-[#171614] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center text-[#171614] transition-colors hover:bg-[#F3EFEA] focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAdd}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162C49] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
              >
                {addedFeedback ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Order Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>
                      {product.inStock
                        ? `Add to Order Bag — ${formatNaira(product.price * quantity)}`
                        : "Currently Out of Stock"}
                    </span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#D8D0C5] bg-white px-5 py-2.5 text-sm font-medium text-[#171614] transition-colors hover:border-[#171614] hover:bg-[#F3EFEA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
              >
                <MessageCircle className="h-4 w-4 text-[#1E3A5F]" />
                <span>Inquire Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
