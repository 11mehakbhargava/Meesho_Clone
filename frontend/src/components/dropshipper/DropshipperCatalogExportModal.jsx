import { useState, useMemo } from 'react';
import {
  X,
  Download,
  Store,
  Layers,
  Sparkles,
  Percent,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Package,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateExportPrices,
  generateShopifyCsv,
  generateWooCommerceCsv,
  generateUniversalCsv,
  triggerCsvDownload
} from '../../utils/catalogExportGenerators';

export default function DropshipperCatalogExportModal({
  isOpen,
  onClose,
  products = [],
  selectedProducts = [],
  marginConfig = null,
  storeName = 'My Dropship Store'
}) {
  const [platform, setPlatform] = useState('shopify'); // 'shopify' | 'woocommerce' | 'universal'
  const [exportScope, setExportScope] = useState(selectedProducts.length > 0 ? 'selected' : 'all'); // 'selected' | 'all'
  const [marginStrategy, setMarginStrategy] = useState('SAVED_RULES'); // 'SAVED_RULES' | 'PERCENTAGE' | 'FIXED'
  const [customPercent, setCustomPercent] = useState('35');
  const [customFixed, setCustomFixed] = useState('250');
  const [roundTo99, setRoundTo99] = useState(true);
  const [includeMrpDiscount, setIncludeMrpDiscount] = useState(true);
  const [mrpMarkupPct, setMrpMarkupPct] = useState('40');
  const [showGuide, setShowGuide] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Determine which product list to export
  const exportTargetProducts = useMemo(() => {
    if (exportScope === 'selected' && selectedProducts.length > 0) {
      return selectedProducts;
    }
    return products;
  }, [exportScope, selectedProducts, products]);

  // Active configuration bundle
  const exportOptions = useMemo(() => {
    return {
      storeName,
      marginStrategy,
      customPercent: Number(customPercent) || 35,
      customFixed: Number(customFixed) || 250,
      roundTo99,
      mrpMarkupPct: includeMrpDiscount ? Number(mrpMarkupPct) || 40 : 0
    };
  }, [storeName, marginStrategy, customPercent, customFixed, roundTo99, includeMrpDiscount, mrpMarkupPct]);

  // Compute live preview on the first 2 items
  const previewProducts = useMemo(() => {
    return (exportTargetProducts || []).slice(0, 2).map((p) => {
      const pricing = calculateExportPrices(p, marginConfig, exportOptions);
      return {
        ...p,
        pricing
      };
    });
  }, [exportTargetProducts, marginConfig, exportOptions]);

  if (!isOpen) return null;

  const handleExport = () => {
    if (exportTargetProducts.length === 0) {
      toast.warning('No products selected to export');
      return;
    }

    setIsExporting(true);
    try {
      let csvContent = '';
      let filename = '';
      const dateStr = new Date().toISOString().split('T')[0];

      if (platform === 'shopify') {
        csvContent = generateShopifyCsv(exportTargetProducts, marginConfig, exportOptions);
        filename = `Shopify_Products_Feed_${dateStr}.csv`;
      } else if (platform === 'woocommerce') {
        csvContent = generateWooCommerceCsv(exportTargetProducts, marginConfig, exportOptions);
        filename = `WooCommerce_Products_Feed_${dateStr}.csv`;
      } else {
        csvContent = generateUniversalCsv(exportTargetProducts, marginConfig, exportOptions);
        filename = `MShoppy_Wholesale_Catalog_${dateStr}.csv`;
      }

      triggerCsvDownload(csvContent, filename);

      toast.success(`Exported ${exportTargetProducts.length} products!`, {
        description: `Downloaded ${filename} ready for 1-click import into your store.`
      });

      // Show quick guide on first successful export
      setShowGuide(true);
    } catch (err) {
      console.error('Export CSV generation error:', err);
      toast.error('Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-white to-pink-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b7004d]/10 text-[#b7004d] flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                1-Click Catalog Export to Store
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready-to-import
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Directly import factory products into Shopify, WooCommerce, or Excel with custom margins.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. Target Platform Selection */}
          <div>
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2.5">
              1. Choose Destination Platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Shopify */}
              <button
                type="button"
                onClick={() => setPlatform('shopify')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  platform === 'shopify'
                    ? 'border-[#b7004d] bg-pink-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                    🛍️
                  </div>
                  {platform === 'shopify' && (
                    <span className="w-2 h-2 rounded-full bg-[#b7004d]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-gray-900">Shopify CSV</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Official 2024 Product Schema with Handles & HTML</p>
              </button>

              {/* WooCommerce */}
              <button
                type="button"
                onClick={() => setPlatform('woocommerce')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  platform === 'woocommerce'
                    ? 'border-[#b7004d] bg-pink-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                    📦
                  </div>
                  {platform === 'woocommerce' && (
                    <span className="w-2 h-2 rounded-full bg-[#b7004d]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-gray-900">WooCommerce CSV</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Standard WP Product Importer with SKUs & Sale Price</p>
              </button>

              {/* Universal Spreadsheet */}
              <button
                type="button"
                onClick={() => setPlatform('universal')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  platform === 'universal'
                    ? 'border-[#b7004d] bg-pink-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                    📊
                  </div>
                  {platform === 'universal' && (
                    <span className="w-2 h-2 rounded-full bg-[#b7004d]" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-gray-900">Universal Excel / CSV</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Clean audit feed with wholesale & retail columns</p>
              </button>
            </div>
          </div>

          {/* 2. Scope Selection (If products are checked) */}
          {selectedProducts.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-600" />
                  Product Scope Selection:
                </span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  You have selected {selectedProducts.length} items from the wholesale catalog.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExportScope('selected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    exportScope === 'selected'
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white text-amber-900 border border-amber-300'
                  }`}
                >
                  Selected ({selectedProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    exportScope === 'all'
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white text-amber-900 border border-amber-300'
                  }`}
                >
                  All Filtered ({products.length})
                </button>
              </div>
            </div>
          )}

          {/* 3. Margin & Markup Pricing Rules */}
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  2. Pricing & Margin Injection
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Your profit margin is automatically baked into the retail export price.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#b7004d] bg-pink-100 px-2.5 py-1 rounded-full">
                Auto-calculated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMarginStrategy('SAVED_RULES')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  marginStrategy === 'SAVED_RULES'
                    ? 'border-[#b7004d] bg-white text-[#b7004d] shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>Store Rules</span>
                <p className="text-[10px] text-gray-400 font-normal mt-0.5">
                  {marginConfig?.pricingStrategy === 'FIXED'
                    ? `Fixed +₹${marginConfig.fixedMarkup || 250}`
                    : `+${marginConfig?.percentageMarkup || 30}% Markup`}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMarginStrategy('PERCENTAGE')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  marginStrategy === 'PERCENTAGE'
                    ? 'border-[#b7004d] bg-white text-[#b7004d] shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>Custom Markup %</span>
                <p className="text-[10px] text-gray-400 font-normal mt-0.5">Set custom profit percentage</p>
              </button>

              <button
                type="button"
                onClick={() => setMarginStrategy('FIXED')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  marginStrategy === 'FIXED'
                    ? 'border-[#b7004d] bg-white text-[#b7004d] shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>Flat Markup ₹</span>
                <p className="text-[10px] text-gray-400 font-normal mt-0.5">Fixed rupees profit per piece</p>
              </button>
            </div>

            {/* Custom Input depending on strategy */}
            {marginStrategy === 'PERCENTAGE' && (
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-600">Markup Percentage:</span>
                <div className="relative w-32">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={customPercent}
                    onChange={(e) => setCustomPercent(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-[#b7004d] outline-none"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-gray-400 font-bold">%</span>
                </div>
                <span className="text-[11px] text-gray-400">(e.g. ₹500 item sells at ₹{Math.round(500 * (1 + (Number(customPercent) || 35) / 100))})</span>
              </div>
            )}

            {marginStrategy === 'FIXED' && (
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-600">Fixed Rupee Profit:</span>
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={customFixed}
                    onChange={(e) => setCustomFixed(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-200 rounded-lg pl-6 pr-2.5 py-1.5 focus:border-[#b7004d] outline-none"
                  />
                </div>
                <span className="text-[11px] text-gray-400">(e.g. ₹500 item sells at ₹{500 + (Number(customFixed) || 250)})</span>
              </div>
            )}

            {/* Conversion Optimization Toggles */}
            <div className="pt-2 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={roundTo99}
                  onChange={(e) => setRoundTo99(e.target.checked)}
                  className="rounded text-[#b7004d] focus:ring-[#b7004d] w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-gray-800">Psychological .99 Pricing</span>
                  <span className="text-[10px] text-gray-500 block">Rounds prices to e.g. ₹649 or ₹799 (+28% higher clicks)</span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeMrpDiscount}
                  onChange={(e) => setIncludeMrpDiscount(e.target.checked)}
                  className="rounded text-[#b7004d] focus:ring-[#b7004d] w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-gray-800">Auto MRP Strike-Through</span>
                  <span className="text-[10px] text-gray-500 block">Generates compare-at price (e.g. ~₹1,499~ ₹899)</span>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Real-time Live Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                3. Live Export Price Sample (First 2 SKUs)
              </label>
              <span className="text-[11px] text-gray-500">Total {exportTargetProducts.length} items to export</span>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white">
              {previewProducts.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">No products available in preview</div>
              ) : (
                previewProducts.map((p) => {
                  const img = Array.isArray(p.images) ? p.images[0] : (p.images || p.image || '/placeholder.png');
                  return (
                    <div key={p.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img}
                          alt={p.title || p.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-50"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                            {p.title || p.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                            <span>Cost: ₹{p.pricing.wholesale}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">
                              Profit: +₹{p.pricing.netMargin} ({p.pricing.marginPct}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-[#b7004d]">
                          ₹{p.pricing.selling}
                        </div>
                        {includeMrpDiscount && (
                          <div className="text-[10px] text-gray-400 line-through">
                            MRP ₹{p.pricing.compareAtPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 5. In-App Step-by-Step Import Guidance */}
          <div className="bg-pink-50/50 border border-pink-200/60 rounded-2xl p-3.5">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#b7004d]" />
                <span className="text-xs font-bold text-gray-900">
                  How to upload this CSV into {platform === 'shopify' ? 'Shopify' : platform === 'woocommerce' ? 'WooCommerce' : 'Your Store'} (2 Steps)
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showGuide ? 'rotate-90' : ''}`} />
            </button>

            {showGuide && (
              <div className="mt-3 pt-3 border-t border-pink-200/60 text-xs text-gray-600 space-y-2 animate-in fade-in">
                {platform === 'shopify' ? (
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>
                      Log in to your <strong>Shopify Admin</strong> &gt; Click <strong>Products</strong> on the left menu.
                    </li>
                    <li>
                      Click the <strong>Import</strong> button at top right &gt; Select the downloaded CSV file.
                    </li>
                    <li>
                      Click <strong>"Upload and preview"</strong> &gt; <strong>"Import products"</strong>. Your entire catalog with margins and images goes live instantly!
                    </li>
                  </ol>
                ) : platform === 'woocommerce' ? (
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>
                      Log in to your <strong>WordPress Dashboard</strong> &gt; Go to <strong>Products</strong> &gt; <strong>All Products</strong>.
                    </li>
                    <li>
                      Click <strong>Import</strong> at the top &gt; Upload the downloaded WooCommerce CSV.
                    </li>
                    <li>
                      Leave default mapping and click <strong>"Run the importer"</strong>. All products and prices sync automatically!
                    </li>
                  </ol>
                ) : (
                  <p>
                    Open the downloaded CSV directly in Microsoft Excel, Google Sheets, or LibreOffice. Includes all image links, supplier hubs, SKUs, and margin breakdowns.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
          <div className="text-xs text-gray-500 text-center sm:text-left">
            Exporting <strong className="text-gray-900">{exportTargetProducts.length}</strong> wholesale products for{' '}
            <strong className="text-[#b7004d]">{platform === 'shopify' ? 'Shopify' : platform === 'woocommerce' ? 'WooCommerce' : 'Universal CSV'}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || exportTargetProducts.length === 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#92003d] text-white text-xs font-bold shadow-md shadow-[#b7004d]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download {platform === 'shopify' ? 'Shopify CSV' : platform === 'woocommerce' ? 'WooCommerce CSV' : 'Catalog CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

