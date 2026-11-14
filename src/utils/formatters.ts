import type { ProductItem } from "../shopConfig";

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function parseColorOptions(colorsString: string): string[] {
  return colorsString
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildSingleProductWhatsAppMessage(
  shopName: string,
  product: ProductItem,
  selectedColor: string,
  quantity: number
): string {
  const subtotal = product.price * quantity;
  return [
    `Hello ${shopName}, I would like to inquire/order:`,
    `- Fabric: ${product.name}`,
    `- Color/Shade: ${selectedColor}`,
    `- Quantity: ${quantity} (${product.unit})`,
    `- Estimated Total: ${formatNaira(subtotal)}`,
    ``,
    `Please confirm availability and waybill details.`
  ].join("\n");
}
