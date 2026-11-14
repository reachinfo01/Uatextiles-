import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { FabricImage } from "./components/FabricImage";
import { OrderBagDrawer, type BagItem } from "./components/OrderBagDrawer";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { HERO_IMAGE, PRODUCTS, SHOP_CONFIG, type ProductItem } from "./shopConfig";
import { buildWhatsAppUrl, formatNaira, parseColorOptions } from "./utils/formatters";

type SortOption = "featured" | "price-asc" | "price-desc";

export default function App() {
  const [showNotice, setShowNotice] = useState(Boolean(SHOP_CONFIG.notice));
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Dynamically derive categories from PRODUCTS so edits to shopConfig.ts sync automatically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((p) => p.category)));
    return ["All", ...unique];
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.colors.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const totalBagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems]
  );

  const handleAddToBag = (product: ProductItem, color: string, quantity = 1) => {
    if (!product.inStock) return;
    setBagItems((prev) => {
      const existingIdx = prev.findIndex(
        (entry) => entry.product.id === product.id && entry.color === color
      );
      if (existingIdx > -1) {
        return prev.map((entry, idx) =>
          idx === existingIdx
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { product, color, quantity }];
    });
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1200);
  };

  const handleUpdateQuantity = (productId: string, color: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.color === color
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, color: string) => {
    setBagItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.color === color)
      )
    );
  };

  const handleWholesaleInquiryClick = () => {
    setSelectedCategory("Shadda / Bazin");
    const el = document.getElementById("catalog");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const generalWhatsappUrl = buildWhatsAppUrl(
    SHOP_CONFIG.whatsappNumber,
    `Hello ${SHOP_CONFIG.name}, I would like to inquire about wholesale and retail fabric pricing.`
  );

  const wholesaleWhatsappUrl = buildWhatsAppUrl(
    SHOP_CONFIG.whatsappNumber,
    `Hello ${SHOP_CONFIG.name}, please share your latest wholesale bale rates and reseller catalog.`
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#171614]">
      {/* Slim Dismissible Notice Strip (<= 36px) */}
      {showNotice && SHOP_CONFIG.notice && (
        <div className="border-b border-[#2A2825] bg-[#171614] px-4 py-2 text-xs text-[#F3EFEA]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="truncate font-medium tracking-wide">
              {SHOP_CONFIG.notice}
            </p>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              aria-label="Dismiss delivery notice"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#C7C0B6] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E5DFD6] bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#"
            className="font-display text-xl font-bold tracking-tight text-[#171614] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A5F]"
          >
            {SHOP_CONFIG.name}
          </a>

          {/* Zone 2: 4 Clean Single-line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#524C45]"
          >
            <a
              href="#catalog"
              className="hover:text-[#171614] hover:underline hover:underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Catalog
            </a>
            <a
              href="#wholesale"
              className="hover:text-[#171614] hover:underline hover:underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Wholesale
            </a>
            <a
              href="#delivery"
              className="hover:text-[#171614] hover:underline hover:underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Waybill Delivery
            </a>
            <a
              href="#visit"
              className="hover:text-[#171614] hover:underline hover:underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Visit Shop
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#1E3A5F] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#162C49] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Order Bag</span>
              {totalBagCount > 0 && (
                <span className="font-mono tabular-nums text-[#E2E8F0]">
                  ({totalBagCount})
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Storefront Hero */}
        <section className="border-b border-[#E5DFD6] bg-[#FAF8F5]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Editorial Copy Column */}
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <p className="text-xs font-medium tracking-wide text-[#8C6239]">
                    Kantin Kwari Market · Kano State, Nigeria
                  </p>
                  <h1
                    className="mt-3 font-display font-semibold tracking-tight text-[#171614]"
                    style={{
                      fontSize: "clamp(2.15rem, 3.8vw, 3.35rem)",
                      lineHeight: 1.12,
                      textWrap: "balance",
                    }}
                  >
                    Authentic Shadda, Super Wax Atampa & Swiss Lace
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4A453F]">
                    {SHOP_CONFIG.tagline}. Supplying tailors, wedding planners, boutique owners, and direct shoppers with verified Austrian, Swiss, Italian, and fast-color cotton textiles.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <a
                      href="#catalog"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#171614] px-6 py-2.5 text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#2F2D29] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
                    >
                      <span>Browse Fabrics</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleWholesaleInquiryClick}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#D8D0C5] bg-white px-5 py-2.5 text-sm font-medium text-[#171614] transition-colors hover:border-[#171614] hover:bg-[#F3EFEA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
                    >
                      <span>Wholesale Bales</span>
                    </button>
                  </div>
                </div>

                {/* Clean 3-column merchant facts strip */}
                <div className="mt-9 grid grid-cols-1 gap-4 border-t border-[#E5DFD6] pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-semibold text-[#171614]">
                      Wholesale & Retail
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B655E]">
                      Single cuts (4–6 yds) & 10-pc bales
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171614]">
                      Same-Day Waybill
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B655E]">
                      Dispatch from Kano to all 36 states
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171614]">
                      Market Hours
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B655E]">
                      {SHOP_CONFIG.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Showcase Photography */}
              <div className="lg:col-span-6">
                <div className="h-full overflow-hidden rounded-xl border border-[#E5DFD6] bg-[#F3EFEA]">
                  <img
                    src={HERO_IMAGE}
                    alt="Folded bolts of Royal Shadda guinea brocade, emerald Super Wax Atampa, and champagne Swiss voile lace at UA Textiles"
                    referrerPolicy="no-referrer"
                    className="aspect-[16/10] h-full w-full object-cover lg:aspect-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Featured Fabric Catalog */}
        <section id="catalog" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#E5DFD6] pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8C6239]">
                Curated Stock
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-[#171614]">
                Fabric Catalog
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#5C564F]">
              Select any fabric to choose your preferred color shade, adjust yardage or bale quantity, and send your order directly via WhatsApp.
            </p>
          </div>

          {/* Search, Category Filter Tabs & Sort */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Interactive Category Filter Buttons */}
            <div
              role="tablist"
              aria-label="Fabric Categories"
              className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EDE7DE] p-1"
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1E3A5F] ${
                      isActive
                        ? "bg-white text-[#171614] shadow-sm"
                        : "text-[#524C45] hover:text-[#171614]"
                    }`}
                  >
                    {category === "All" ? "All Fabrics" : category}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655E]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shadda, atampa, color..."
                  aria-label="Search fabrics"
                  className="min-h-[40px] w-full rounded-lg border border-[#D8D0C5] bg-white pl-9 pr-3 text-sm text-[#171614] placeholder:text-[#8E877E] focus:border-[#1E3A5F] focus:outline-none sm:w-64"
                />
              </div>

              <select
                aria-label="Sort fabrics"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-h-[40px] rounded-lg border border-[#D8D0C5] bg-white px-3 text-sm text-[#171614] focus:border-[#1E3A5F] focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="mt-10 rounded-xl border border-[#E5DFD6] bg-white px-6 py-14 text-center">
              <h3 className="font-display text-xl font-medium text-[#171614]">
                No matching fabrics found
              </h3>
              <p className="mt-2 text-sm text-[#6B655E]">
                Try clearing your search term or switching back to all fabric categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setSortBy("featured");
                }}
                className="mt-5 min-h-[40px] rounded-lg bg-[#171614] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2F2D29]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredProducts.map((product) => {
                const shades = parseColorOptions(product.colors);
                const defaultShade = shades[0] || "Assorted";
                const isJustAdded = recentlyAddedId === product.id;

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#E5DFD6] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Card Imagery (~65-70% height focus) */}
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="relative block w-full overflow-hidden bg-[#F3EFEA] text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1E3A5F]"
                      aria-label={`View details for ${product.name}`}
                    >
                      <FabricImage
                        src={product.image}
                        alt={product.name}
                        swatchColor={product.swatchColor}
                        title={product.name}
                        className="aspect-[4/3] w-full"
                        imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        {/* Quiet 1-line unboxed metadata */}
                        <div className="flex items-center gap-2 text-xs text-[#6B655E]">
                          <span className="uppercase tracking-wider">
                            {product.category}
                          </span>
                          {product.badge && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-[#8C6239]">
                                {product.badge}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-[#171614]">
                          <button
                            type="button"
                            onClick={() => setActiveProduct(product)}
                            className="text-left hover:text-[#1E3A5F] focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                          >
                            {product.name}
                          </button>
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5C564F]">
                          {product.description}
                        </p>

                        <p className="mt-2.5 text-xs text-[#6B655E]">
                          Shades: <span className="text-[#3E3A35]">{product.colors}</span>
                        </p>
                      </div>

                      {/* Aligned Price & Action Baseline */}
                      <div className="mt-5 border-t border-[#EFEAE2] pt-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-mono text-lg font-semibold text-[#171614] tabular-nums">
                            {formatNaira(product.price)}
                          </span>
                          <span className="text-xs text-[#6B655E]">
                            {product.unit}
                          </span>
                        </div>

                        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setActiveProduct(product)}
                            className="min-h-[40px] rounded-lg border border-[#D8D0C5] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#171614] transition-colors hover:border-[#171614] hover:bg-[#F3EFEA] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                          >
                            Select Shade
                          </button>
                          <button
                            type="button"
                            disabled={!product.inStock}
                            onClick={() => handleAddToBag(product, defaultShade, 1)}
                            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-[#1E3A5F] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#162C49] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>
                                {product.inStock ? "Add to Bag" : "Out of Stock"}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 3: Wholesale & Nationwide Waybill Delivery */}
        <section className="border-t border-[#E5DFD6] bg-[#F3EFEA]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Wholesale Bales */}
              <div id="wholesale" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6239]">
                    <Package className="h-4 w-4" aria-hidden="true" />
                    <span>Trade & Reseller Supply</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-[#171614] md:text-3xl">
                    Wholesale Bales & Event Aso-Ebi
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#4A453F]">
                    We supply market resellers, boutique owners, and wedding coordinators across Nigeria directly from Kantin Kwari. Factory-packed 10-piece Polish Shadda bales and bulk yardage orders qualify for merchant rates.
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-[#DFD8CE] pt-5 text-sm text-[#3E3A35]">
                    <li>· Factory-sealed 10-piece bales with assorted or uniform colors</li>
                    <li>· Matching Swiss Voile & Shadda bundles for weddings and ceremonies</li>
                    <li>· Live video/photo verification of your exact bale before dispatch</li>
                  </ul>
                </div>

                <div className="mt-7">
                  <a
                    href={wholesaleWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#171614] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2F2D29] whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Request Wholesale Price List</span>
                  </a>
                </div>
              </div>

              {/* Nationwide Waybill Delivery */}
              <div
                id="delivery"
                className="flex flex-col justify-between border-t border-[#DFD8CE] pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A5F]">
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    <span>Kano Nationwide Dispatch</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-[#171614] md:text-3xl">
                    Waybill Delivery Across Nigeria
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#4A453F]">
                    Orders confirmed before 3:00 PM are packaged and dispatched the same day via trusted motor parks and commercial cargo carriers departing Kano.
                  </p>

                  <div className="mt-5 space-y-3 border-t border-[#DFD8CE] pt-5 text-sm text-[#3E3A35]">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8C6239]"
                        aria-hidden="true"
                      />
                      <span>{SHOP_CONFIG.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8C6239]"
                        aria-hidden="true"
                      />
                      <span>{SHOP_CONFIG.hours}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-[#6B655E]">
                  Major Routes: Kano → Abuja (FCT), Lagos, Kaduna, Katsina, Sokoto, Maiduguri, Jos, Gombe, Port Harcourt & nationwide park pickup.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Merchant Footer */}
      <footer id="visit" className="border-t border-[#E5DFD6] bg-[#171614] text-[#F3EFEA]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-xl font-semibold text-white">
                {SHOP_CONFIG.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#C7C0B6]">
                {SHOP_CONFIG.tagline}
              </p>
            </div>

            <div className="text-sm text-[#C7C0B6]">
              <p className="font-semibold text-white">Shop Address & Hours</p>
              <p className="mt-2 leading-relaxed">{SHOP_CONFIG.address}</p>
              <p className="mt-1">{SHOP_CONFIG.hours}</p>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <p className="text-sm font-semibold text-white">Direct Merchant Desk</p>
              <a
                href={generalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#171614] transition-colors hover:bg-[#EDE7DE] whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#2E2C28] pt-6 text-xs text-[#9C958B] sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} {SHOP_CONFIG.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <a
                    key={cat}
                    href="#catalog"
                    onClick={() => setSelectedCategory(cat)}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToBag={handleAddToBag}
      />

      <OrderBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
      />
    </div>
  );
}
