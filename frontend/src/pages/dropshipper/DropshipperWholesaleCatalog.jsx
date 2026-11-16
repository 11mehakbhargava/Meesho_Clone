import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DROPSHIPPER_MENU } from './dropshipperMenu';
import { getProducts } from '../../services/ecommerceService';
import {
  getDropshipperMarginConfigApi,
  saveDropshipperMarginConfigApi,
  syncProductToChannelApi
} from '../../services/dropshipperService';
import {
  Package,
  Search,
  Download,
  Send,
  Sparkles,
  Star,
  RefreshCw,
  Eye,
  X,
  Calculator,
  Truck,
  ArrowRight,
  Share2,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Save,
  Tag,
  CheckSquare,
  Square,
  FileSpreadsheet
} from 'lucide-react';
import DropshipperCatalogExportModal from '../../components/dropshipper/DropshipperCatalogExportModal';
import { toast } from 'sonner';

const CATEGORIES = [
  'All',
  'Women Ethnic',
  'Women Western',
  'Men',
  'Kids',
  'Home & Kitchen',
  'Beauty & Health',
  'Jewellery',
  'Footwear',
  'Electronics'
];

export default function DropshipperWholesaleCatalog() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user || {});
  const dropshipperName = currentUser?.fullName || 'Verified Dropshipper';
  const userUid = currentUser?.uid || currentUser?.id || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under299' | '300-599' | '600-999' | '1000+'
  const [sortBy, setSortBy] = useState('margin-high'); // 'margin-high' | 'price-low' | 'price-high' | 'rating'

  // Configured Dropshipper Margin Rules (Auto-synced from database)
  const [marginConfig, setMarginConfig] = useState(null);

  // Modals state
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [calculatorProduct, setCalculatorProduct] = useState(null);
  const [customSellingPrice, setCustomSellingPrice] = useState('');

  // 1-Click Store Channel Sync Modal State
  const [syncProductModal, setSyncProductModal] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState('Shopify Store');
  const [isSyncingChannel, setIsSyncingChannel] = useState(false);
  const [syncSuccessResult, setSyncSuccessResult] = useState(null);

  // 1-Click Store Export Modal & Multi-Selection State (Step 4)
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Selection management helpers
  const toggleSelectProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  // Memoized array of selected product objects
  const selectedProductObjects = useMemo(() => {
    return products.filter((p) => selectedProductIds.includes(p.id));
  }, [products, selectedProductIds]);

  // 1. Fetch live wholesale products & user margin rules from database on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [prodData, marginRes] = await Promise.allSettled([
          getProducts({ limit: 100 }),
          userUid ? getDropshipperMarginConfigApi(userUid) : Promise.resolve(null)
        ]);

        if (isMounted && prodData.status === 'fulfilled' && Array.isArray(prodData.value)) {
          setProducts(prodData.value);
        }
        if (isMounted && marginRes.status === 'fulfilled' && marginRes.value?.success && marginRes.value.config) {
          setMarginConfig(marginRes.value.config);
        }
      } catch (err) {
        console.error('Error loading wholesale catalog or margin config:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [userUid]);

  const refreshWholesaleProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      if (Array.isArray(data)) {
        setProducts(data);
        toast.success('Wholesale catalog refreshed!');
      }
    } catch (err) {
      console.error('Error refreshing catalog:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // 2. Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = (p.title || p.name || '').toLowerCase();
          const category = (p.category?.name || p.categorySlug || '').toLowerCase();
          const supplier = (p.supplierName || 'Verified Supplier').toLowerCase();
          if (!title.includes(q) && !category.includes(q) && !supplier.includes(q)) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'All') {
          const cat = (p.category?.name || p.categorySlug || '').toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (!cat.includes(target) && !target.includes(cat)) {
            return false;
          }
        }

        // Price Filter
        const price = Number(p.price || 0);
        if (priceFilter === 'under299' && price >= 299) return false;
        if (priceFilter === '300-599' && (price < 300 || price > 599)) return false;
        if (priceFilter === '600-999' && (price < 600 || price > 999)) return false;
        if (priceFilter === '1000+' && price < 1000) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        const mrpA = Number(a.mrp || priceA * 1.6);
        const mrpB = Number(b.mrp || priceB * 1.6);
        const marginA = mrpA - priceA;
        const marginB = mrpB - priceB;

        if (sortBy === 'margin-high') return marginB - marginA;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, priceFilter, sortBy]);

  // 3. Dynamic Margin Computation using active Dropshipper Rules (3-Tier Hierarchy)
  // Priority 1: Product-Specific Custom Override -> Priority 2: Category Override -> Priority 3: Global Strategy
  const computeProductMargins = (product) => {
    const wholesale = Number(product.price || 0);
    const srp = Number(product.mrp || Math.round(wholesale * 1.6));

    if (!marginConfig) {
      const defaultMargin = Math.max(0, srp - wholesale - 60);
      return {
        wholesale,
        selling: srp,
        margin: defaultMargin,
        marginPct: srp > 0 ? Math.round((defaultMargin / srp) * 100) : 0,
        ruleBadge: 'Default 60% SRP',
        isCustomRule: false,
        isItemOverride: false,
        matchedProductRule: null
      };
    }

    // Priority 1: Product-Specific Custom Override (Highest)
    const productIdStr = String(product.id || '');
    const productSkuStr = String(product.sku || '').toLowerCase();
    const productTitleStr = String(product.title || product.name || '').toLowerCase();

    const matchedProduct = (marginConfig.productRules || []).find((r) => {
      if (!r) return false;
      if (r.productId && String(r.productId) === productIdStr) return true;
      if (r.sku && productSkuStr && String(r.sku).toLowerCase() === productSkuStr) return true;
      if (r.title && productTitleStr && (productTitleStr.includes(r.title.toLowerCase()) || r.title.toLowerCase().includes(productTitleStr))) return true;
      return false;
    });

    // Priority 2: Category-Specific Override (Medium)
    const catName = (product.category?.name || product.categorySlug || '').toLowerCase();
    const matchedCategory = (marginConfig.categoryRules || []).find((r) => {
      const target = (r.categoryName || r.name || r.slug || '').toLowerCase();
      return target && (target.includes(catName) || catName.includes(target));
    });

    let calculatedSelling;
    let ruleBadge;
    let isItemOverride = false;

    if (matchedProduct) {
      isItemOverride = true;
      if (matchedProduct.customPrice && Number(matchedProduct.customPrice) > 0) {
        calculatedSelling = Number(matchedProduct.customPrice);
        const diff = calculatedSelling - wholesale;
        ruleBadge = `Item Override: ₹${calculatedSelling} (${diff >= 0 ? '+' : ''}₹${diff})`;
      } else if (matchedProduct.type === 'percentage') {
        const val = Number(matchedProduct.value || matchedProduct.markupValue || 25);
        calculatedSelling = wholesale * (1 + val / 100);
        ruleBadge = `Item Override: +${val}%`;
      } else {
        const val = Number(matchedProduct.value || matchedProduct.markupValue || 300);
        calculatedSelling = wholesale + val;
        ruleBadge = `Item Override: +₹${val}`;
      }
    } else if (matchedCategory) {
      const val = Number(matchedCategory.markupValue || matchedCategory.markup || 250);
      calculatedSelling = wholesale + val;
      ruleBadge = `Niche: ${matchedCategory.categoryName || matchedCategory.name} (+₹${val})`;
    } else if (marginConfig.pricingStrategy === 'PERCENTAGE') {
      const pct = Number(marginConfig.percentageMarkup || 25);
      calculatedSelling = wholesale * (1 + pct / 100);
      ruleBadge = `Rule: +${pct}% Markup`;
    } else {
      const fix = Number(marginConfig.fixedMarkup || 200);
      calculatedSelling = wholesale + fix;
      ruleBadge = `Rule: Fixed +₹${fix}`;
    }

    // Shipping mode
    let shipping = 0;
    if (marginConfig.shippingMode === 'FREE_TO_CUSTOMER') {
      shipping = Number(marginConfig.estimatedShippingFee || 60);
    }

    // Smart Rounding (e.g. 749 or 799) - Only apply if not an exact custom price
    let finalSelling = Math.round(calculatedSelling);
    if (!matchedProduct?.customPrice && marginConfig.smartRounding && finalSelling >= 100) {
      finalSelling = Math.floor(finalSelling / 10) * 10 - 1;
    }

    const netMargin = Math.max(0, finalSelling - wholesale - shipping);
    const marginPct = finalSelling > 0 ? Math.round((netMargin / finalSelling) * 100) : 0;

    return {
      wholesale,
      selling: finalSelling,
      margin: netMargin,
      marginPct,
      ruleBadge,
      isCustomRule: Boolean(matchedProduct || matchedCategory || marginConfig.pricingStrategy),
      isItemOverride,
      matchedProductRule: matchedProduct || null
    };
  };

  // 4. Navigate to Order Push with preselected product & pre-filled margin selling price
  const handlePushOrder = (product, overrideSellingPrice = null) => {
    const marginData = computeProductMargins(product);
    const finalPrice = overrideSellingPrice !== null && Number(overrideSellingPrice) > 0
      ? Number(overrideSellingPrice)
      : marginData.selling;
    const displayImg = Array.isArray(product.images)
      ? product.images[0]
      : (product.images || product.image || '');

    const prefilledProduct = {
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      wholesaleCost: product.price,
      customerPrice: finalPrice,
      mrp: product.mrp || Math.round(product.price * 1.6),
      sku: product.sku || `SKU-${String(product.id || 'ITEM').slice(0, 8).toUpperCase()}`,
      image: displayImg
    };

    try {
      sessionStorage.setItem('meesho_prefilled_order_product', JSON.stringify(prefilledProduct));
    } catch (e) {
      console.warn('SessionStorage prefilledProduct error:', e);
    }

    navigate('/dropshipper-orders-push', {
      state: {
        prefilledProduct
      }
    });
  };

  // 5. 1-Click Export Catalog to Store Modal (Step 4)
  const handleExportCsv = () => {
    if (filteredProducts.length === 0) {
      toast.warning('No products to export in this category filter');
      return;
    }
    setIsExportModalOpen(true);
  };

  // 6. Open Margin Calculator with Active Configured Selling Price
  const handleOpenCalculator = (product) => {
    setCalculatorProduct(product);
    const marginData = computeProductMargins(product);
    setCustomSellingPrice(String(marginData.selling));
  };

  const calculateCustomMargin = () => {
    if (!calculatorProduct) return { wholesale: 0, selling: 0, shipping: 60, margin: 0, marginPct: 0 };
    const wholesale = Number(calculatorProduct.price || 0);
    const selling = Number(customSellingPrice) || wholesale;
    const shipping = 60; // Standard dropship courier
    const margin = Math.max(0, selling - wholesale - shipping);
    const marginPct = selling > 0 ? Math.round((margin / selling) * 100) : 0;
    return { wholesale, selling, shipping, margin, marginPct };
  };

  const customCalc = calculateCustomMargin();

  // 6b. Save or Remove Product-Specific Custom Margin Override (Tier 1 Priority)
  const [isSavingProductRule, setIsSavingProductRule] = useState(false);

  const handleSaveProductRule = async (product, customPriceVal) => {
    if (!product || !userUid) {
      toast.error('Please log in as a dropshipper to save margin rules.');
      return;
    }
    const finalPrice = Math.round(Number(customPriceVal));
    const wholesale = Number(product.price || 0);
    if (!finalPrice || finalPrice <= 0) {
      toast.error('Please enter a valid selling price.');
      return;
    }
    if (finalPrice <= wholesale) {
      toast.warning('Selling price is less than or equal to wholesale cost!');
    }

    setIsSavingProductRule(true);
    try {
      const prodIdStr = String(product.id || '');
      const prodSku = product.sku || `SKU-${prodIdStr.slice(0, 8).toUpperCase()}`;
      const prodTitle = product.title || product.name || 'Custom Product';

      const existingRules = Array.isArray(marginConfig?.productRules) ? marginConfig.productRules : [];
      // Remove any existing rule for this product ID or SKU
      const filteredRules = existingRules.filter(
        (r) => String(r.productId) !== prodIdStr && (!r.sku || r.sku.toLowerCase() !== prodSku.toLowerCase())
      );

      const newProductRule = {
        productId: prodIdStr,
        sku: prodSku,
        title: prodTitle,
        customPrice: finalPrice,
        markupValue: finalPrice - wholesale,
        type: 'custom_price',
        updatedAt: new Date().toISOString()
      };

      const updatedRules = [newProductRule, ...filteredRules];

      const res = await saveDropshipperMarginConfigApi({
        firebaseUid: userUid,
        pricingStrategy: marginConfig?.pricingStrategy || 'FIXED',
        fixedMarkup: marginConfig?.fixedMarkup ?? 200,
        percentageMarkup: marginConfig?.percentageMarkup ?? 25,
        smartRounding: marginConfig?.smartRounding ?? true,
        shippingMode: marginConfig?.shippingMode || 'FREE_TO_CUSTOMER',
        estimatedShippingFee: marginConfig?.estimatedShippingFee ?? 60,
        categoryRules: marginConfig?.categoryRules || [],
        productRules: updatedRules
      });

      if (res?.success) {
        setMarginConfig((prev) => ({
          ...(prev || {}),
          productRules: updatedRules
        }));
        toast.success(`Custom rule saved for ${prodTitle.slice(0, 30)}...!`, {
          description: `This product will now always sell at ₹${finalPrice} with ₹${finalPrice - wholesale} margin.`
        });
      }
    } catch (err) {
      console.error('Save product margin rule error:', err);
      toast.error('Failed to save product margin override.');
    } finally {
      setIsSavingProductRule(false);
    }
  };

  const handleRemoveProductRule = async (product) => {
    if (!product || !userUid) return;
    setIsSavingProductRule(true);
    try {
      const prodIdStr = String(product.id || '');
      const prodSku = String(product.sku || '').toLowerCase();
      const existingRules = Array.isArray(marginConfig?.productRules) ? marginConfig.productRules : [];
      const updatedRules = existingRules.filter(
        (r) => String(r.productId) !== prodIdStr && (!r.sku || String(r.sku).toLowerCase() !== prodSku)
      );

      const res = await saveDropshipperMarginConfigApi({
        firebaseUid: userUid,
        pricingStrategy: marginConfig?.pricingStrategy || 'FIXED',
        fixedMarkup: marginConfig?.fixedMarkup ?? 200,
        percentageMarkup: marginConfig?.percentageMarkup ?? 25,
        smartRounding: marginConfig?.smartRounding ?? true,
        shippingMode: marginConfig?.shippingMode || 'FREE_TO_CUSTOMER',
        estimatedShippingFee: marginConfig?.estimatedShippingFee ?? 60,
        categoryRules: marginConfig?.categoryRules || [],
        productRules: updatedRules
      });

      if (res?.success) {
        const nextConfig = {
          ...(marginConfig || {}),
          productRules: updatedRules
        };
        setMarginConfig(nextConfig);
        toast.info('Product-specific override removed. Fallback rule restored.');
        // Recalculate price with product rule removed
        const fallbackRule = computeProductMargins({
          ...product,
          id: '__temp_none__'
        });
        setCustomSellingPrice(String(fallbackRule.selling));
      }
    } catch (err) {
      console.error('Remove product rule error:', err);
      toast.error('Failed to remove product override.');
    } finally {
      setIsSavingProductRule(false);
    }
  };

  // 7. Handle 1-Click Store Channel Sync Modal
  const handleOpenSyncModal = (product) => {
    setSyncProductModal(product);
    setSyncSuccessResult(null);
  };

  const handleExecuteChannelSync = async () => {
    if (!syncProductModal) return;
    if (!userUid) {
      toast.error('Please login to sync products to store channels');
      return;
    }

    setIsSyncingChannel(true);
    try {
      const marginData = computeProductMargins(syncProductModal);
      const displayImg = Array.isArray(syncProductModal.images)
        ? syncProductModal.images[0]
        : (syncProductModal.images || syncProductModal.image || '');

      const payload = {
        firebaseUid: userUid,
        productId: syncProductModal.id,
        productTitle: syncProductModal.title || syncProductModal.name,
        productImage: displayImg,
        wholesalePrice: marginData.wholesale,
        sellingPrice: marginData.selling,
        channelPlatform: selectedChannel,
        sku: syncProductModal.sku || `SKU-DS-${syncProductModal.id?.slice?.(0, 6) || 'ITEM'}`,
        category: syncProductModal.category?.name || syncProductModal.categorySlug || 'Fashion'
      };

      const res = await syncProductToChannelApi(payload);
      if (res?.success) {
        setSyncSuccessResult(res);
        toast.success(res.message || 'Product published to store successfully!');
      } else {
        toast.error(res?.message || 'Failed to sync product to store');
      }
    } catch (err) {
      console.error('Channel Sync Error:', err);
      toast.error(err?.response?.data?.message || 'Error communicating with store webhook');
    } finally {
      setIsSyncingChannel(false);
    }
  };

  return (
    <DashboardLayout
      menuItems={DROPSHIPPER_MENU}
      activeTab="wholesale-catalog"
      onTabChange={(tabId) => {
        const item = DROPSHIPPER_MENU.find((m) => m.id === tabId) ||
          DROPSHIPPER_MENU.flatMap((m) => m.children || []).find((c) => c.id === tabId);
        if (item?.path) navigate(item.path);
      }}
      roleName="DROPSHIPPER"
      userName={dropshipperName}
      pageTitle="B2B Wholesale Sourcing Hub"
      pageSubtitle="Browse supplier-direct inventory with verified wholesale pricing, zero MOQ, and instant order dispatch."
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-300">
        
        {/* ======================================================== */}
        {/* HEADER HERO BANNER & STATS */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ffe4ec] via-[#fff0f4] to-[#ffdae3] p-6 sm:p-8 border border-[#ffb3c6] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b7004d]/10 border border-[#b7004d]/20 text-[#b7004d] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Supplier Network
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#4a2135] tracking-tight mt-2">
                Wholesale Product Sourcing
              </h2>
              <p className="text-sm text-gray-700 mt-1 max-w-2xl leading-relaxed">
                Direct factory pricing from verified Indian manufacturers. Push single orders with custom margin markup, zero advance inventory capital, and white-label customer delivery.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#92003d] text-white text-xs font-bold shadow-md shadow-[#b7004d]/20 flex items-center gap-2 transition-all cursor-pointer"
                title="1-Click Export Catalog to Shopify / WooCommerce CSV"
              >
                <Download className="w-4 h-4" />
                <span>Export to Shopify / Woo CSV</span>
                {selectedProductIds.length > 0 && (
                  <span className="bg-white/25 px-2 py-0.5 rounded-full text-[10px] font-black">
                    {selectedProductIds.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={refreshWholesaleProducts}
                className="p-2.5 rounded-xl bg-white hover:bg-pink-50 text-gray-700 border border-pink-200 shadow-xs transition-all cursor-pointer"
                title="Refresh product database"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b7004d]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-pink-200/60">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">Available SKUs</span>
              <p className="text-xl font-black text-gray-900 mt-0.5">{products.length}+ Items</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">Min. Order Qty</span>
              <p className="text-xl font-black text-emerald-600 mt-0.5">1 Piece (Zero MOQ)</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">Avg. Resale Profit</span>
              <p className="text-xl font-black text-[#b7004d] mt-0.5">35% - 65%</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase">Dispatch SLA</span>
              <p className="text-xl font-black text-indigo-600 mt-0.5">24 - 48 Hours</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ACTIVE MARGIN RULES NOTIFICATION STRIP */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white rounded-2xl p-4 border border-purple-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                  Live Margin Markup Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AUTO-SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {marginConfig ? (
                  <>
                    Active Strategy: <strong className="text-purple-900">{marginConfig.pricingStrategy === 'PERCENTAGE' ? `+${marginConfig.percentageMarkup}% Markup` : `+₹${marginConfig.fixedMarkup} Fixed Markup`}</strong>
                    {' • '}Smart Rounding: <strong>{marginConfig.smartRounding ? 'ON (.99)' : 'OFF'}</strong>
                    {' • '}Shipping: <strong>{marginConfig.shippingMode === 'FREE_TO_CUSTOMER' ? `Free to Buyer (-₹${marginConfig.estimatedShippingFee || 60})` : 'Charged to Buyer'}</strong>
                    {marginConfig.categoryRules?.length > 0 && ` • ${marginConfig.categoryRules.length} Niche Rules Applied`}
                  </>
                ) : (
                  'Default catalog pricing applied (+60% estimated margin). Configure custom profit rules for automatic store markups.'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dropshipper-margin-config')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Adjust Margin Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* SEARCH & FILTERS BAR */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, supplier, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#b7004d] focus:ring-1 focus:ring-[#b7004d] transition-all bg-gray-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under299', label: '< ₹299' },
                { id: '300-599', label: '₹300-₹599' },
                { id: '600-999', label: '₹600-₹999' },
                { id: '1000+', label: '₹1000+' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setPriceFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    priceFilter === pill.id
                      ? 'bg-[#b7004d] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#b7004d]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 font-medium text-gray-700 outline-none focus:border-[#b7004d]"
              >
                <option value="margin-high">Highest Margin %</option>
                <option value="price-low">Wholesale: Low to High</option>
                <option value="price-high">Wholesale: High to Low</option>
                <option value="rating">Top Rated by Resellers</option>
              </select>
            </div>
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ffe4ec] text-[#b7004d] border border-pink-300 shadow-2xs'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Select & Batch Export Bar (Step 4) */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:px-4 rounded-2xl border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#b7004d] transition-colors cursor-pointer select-none"
              >
                {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[#b7004d]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span>
                  {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0
                    ? 'Deselect All'
                    : `Select All (${filteredProducts.length})`}
                </span>
              </button>

              {selectedProductIds.length > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs font-bold text-[#b7004d] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                    {selectedProductIds.length} Selected
                  </span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-gray-500">
                Found <strong>{filteredProducts.length}</strong> Wholesale SKUs
              </span>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#b7004d] text-xs font-bold flex items-center gap-1.5 border border-pink-200 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export {selectedProductIds.length > 0 ? `(${selectedProductIds.length} Selected)` : 'All to CSV'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PRODUCT GRID */}
        {/* ======================================================== */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin text-[#b7004d] mb-3" />
            <p className="text-sm font-semibold text-gray-600">Loading wholesale catalog from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-[#b7004d] mb-3">
              <Package className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-base font-bold text-gray-800">No wholesale products found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or switching category filters to discover supplier inventory.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#b7004d] text-white text-xs font-bold hover:bg-[#96003f] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((p) => {
              const marginData = computeProductMargins(p);
              const wholesalePrice = marginData.wholesale;
              const storeListingPrice = marginData.selling;
              const estMargin = marginData.margin;
              const marginPct = marginData.marginPct;
              const displayImg = Array.isArray(p.images) ? p.images[0] : (p.images || p.image || '/placeholder.png');
              const supplier = p.supplierName || 'Surat Master Supplier';
              const rating = Number(p.rating) || 4.7;

              const isSelected = selectedProductIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group relative ${
                    isSelected ? 'border-[#b7004d] ring-2 ring-[#b7004d]/25' : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  {/* Image & Quick Badges */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={p.title || p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Multi-Select Checkbox (Step 4) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectProduct(p.id);
                      }}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer z-10 ${
                        isSelected
                          ? 'bg-[#b7004d] text-white shadow-md scale-105'
                          : 'bg-white/85 hover:bg-white text-gray-400 hover:text-[#b7004d] backdrop-blur-xs border border-gray-200 shadow-2xs'
                      }`}
                      title={isSelected ? 'Deselect Product' : 'Select for 1-Click Store Export'}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 fill-white text-[#b7004d]" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                        +{marginPct}% MARGIN
                      </span>
                      {marginData.ruleBadge && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${
                          marginData.isItemOverride
                            ? 'bg-amber-600 text-white font-black ring-1 ring-amber-300'
                            : 'bg-purple-700 text-white'
                        }`}>
                          {marginData.isItemOverride ? '★ ' : ''}{marginData.ruleBadge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1">
                        <Truck className="w-2.5 h-2.5 text-pink-300" />
                        Ships 24h
                      </span>
                    </div>

                    {/* Quick View Floating Button */}
                    <button
                      onClick={() => setSelectedProductForModal(p)}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 hover:bg-white text-gray-700 hover:text-[#b7004d] shadow-sm backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Quick View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Supplier & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                        <span className="truncate max-w-[140px] font-medium" title={supplier}>
                          {supplier}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-500 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h4
                        className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-[#b7004d] transition-colors"
                        title={p.title || p.name}
                      >
                        {p.title || p.name}
                      </h4>
                    </div>

                    {/* B2B Pricing Matrix */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-medium">Wholesale Cost</span>
                          <span className="text-base font-black text-gray-900">₹{wholesalePrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block uppercase font-medium">Your Store Price</span>
                          <span className="text-xs font-bold text-[#b7004d]">₹{storeListingPrice}</span>
                        </div>
                      </div>

                      {/* Profit Pill */}
                      <div className="mt-2 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 font-semibold">Your Net Margin:</span>
                        <span className="text-emerald-800 font-black">+₹{estMargin} ({marginPct}%)</span>
                      </div>
                    </div>

                    {/* Action Buttons: Margin | Sync | Push */}
                    <div className="pt-2 grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleOpenCalculator(p)}
                        className="py-2 px-1 rounded-xl bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-[#b7004d] border border-gray-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Calculate custom margin"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>Calc</span>
                      </button>

                      <button
                        onClick={() => handleOpenSyncModal(p)}
                        className="py-2 px-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="1-Click sync to Shopify / WooCommerce"
                      >
                        <Share2 className="w-3 h-3 text-purple-600" />
                        <span>Sync</span>
                      </button>

                      <button
                        onClick={() => handlePushOrder(p)}
                        className="py-2 px-1 rounded-xl bg-[#b7004d] hover:bg-[#96003f] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                        title="Push this order to suppliers"
                      >
                        <Send className="w-3 h-3" />
                        <span>Push</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: QUICK MARGIN CALCULATOR */}
        {/* ======================================================== */}
        {calculatorProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100 animate-in zoom-in-95 duration-150">
              <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-50 text-[#b7004d]">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Live Profit Margin Simulator</h3>
                    <p className="text-[11px] text-gray-500">Calculate net payout before pushing order</p>
                  </div>
                </div>
                <button
                  onClick={() => setCalculatorProduct(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Product Summary */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <img
                    src={Array.isArray(calculatorProduct.images) ? calculatorProduct.images[0] : (calculatorProduct.images || '/placeholder.png')}
                    alt=""
                    className="w-12 h-12 object-cover rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-800 truncate">{calculatorProduct.title || calculatorProduct.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Wholesale Base Cost: <strong className="text-gray-900">₹{calculatorProduct.price}</strong></p>
                  </div>
                </div>



                {/* Interactive Selling Price Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Your Customer Selling Price (₹)
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      {computeProductMargins(calculatorProduct).ruleBadge || 'Active Margin Rule'}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={customSellingPrice}
                    onChange={(e) => setCustomSellingPrice(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-bold border border-gray-300 rounded-xl focus:border-[#b7004d] focus:ring-1 focus:ring-[#b7004d] outline-none"
                    placeholder="Enter customer price"
                  />

                  {/* Preset Margin Markup Buttons */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-xs">
                    <button
                      type="button"
                      onClick={() => setCustomSellingPrice(String(computeProductMargins(calculatorProduct).selling))}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition cursor-pointer text-[11px]"
                      title="Reset to your configured margin rule"
                    >
                      Active Rule: ₹{computeProductMargins(calculatorProduct).selling}
                    </button>
                    {[
                      { label: '+₹200', add: 200 },
                      { label: '+₹300', add: 300 },
                      { label: '+₹500', add: 500 },
                      { label: '+25%', pct: 0.25 }
                    ].map((btn, idx) => {
                      const wholesale = Number(calculatorProduct.price || 0);
                      const val = btn.pct ? Math.round(wholesale * (1 + btn.pct)) : (wholesale + btn.add);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCustomSellingPrice(String(val))}
                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-pink-50 hover:text-[#b7004d] text-gray-700 font-semibold transition cursor-pointer text-[11px]"
                        >
                          {btn.label} (₹{val})
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Product Override Notice & 1-Click Save */}
                  <div className="pt-2">
                    {computeProductMargins(calculatorProduct).isItemOverride ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <Tag className="w-3.5 h-3.5 text-amber-600" />
                          <span>Custom SKU Margin Active</span>
                        </div>
                        <button
                          type="button"
                          disabled={isSavingProductRule}
                          onClick={() => handleRemoveProductRule(calculatorProduct)}
                          className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer text-[11px]"
                        >
                          Remove Rule
                        </button>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled={isSavingProductRule}
                      onClick={() => handleSaveProductRule(calculatorProduct, customSellingPrice)}
                      className="w-full py-2 px-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/90 text-purple-900 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {isSavingProductRule ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-700" />
                      ) : (
                        <Save className="w-3.5 h-3.5 text-purple-700" />
                      )}
                      <span>
                        {computeProductMargins(calculatorProduct).isItemOverride
                          ? 'Update Saved Margin for This Item'
                          : '💾 Save Custom Margin For This Product'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Financial Ledger Breakdown */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/50 to-white border border-pink-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Customer Collects (COD/Prepaid):</span>
                    <span className="font-bold text-gray-900">₹{customCalc.selling}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Less: Supplier Wholesale Cost:</span>
                    <span className="text-red-500 font-semibold">-₹{customCalc.wholesale}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Less: Standard Shipping & AWB:</span>
                    <span className="text-red-500 font-semibold">-₹{customCalc.shipping}</span>
                  </div>
                  <div className="pt-2 border-t border-pink-200 flex justify-between items-baseline">
                    <span className="font-bold text-emerald-800 text-sm">Your Net Profit Margin:</span>
                    <span className="text-lg font-black text-emerald-600">+₹{customCalc.margin} ({customCalc.marginPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Pinned CTA */}
              <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setCalculatorProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const finalPrice = Number(customSellingPrice) || customCalc.selling;
                    const prodToPush = calculatorProduct;
                    setCalculatorProduct(null);
                    handlePushOrder(prodToPush, finalPrice);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#96003f] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Push Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: QUICK PRODUCT SPECS & DETAILS */}
        {/* ======================================================== */}
        {selectedProductForModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100 animate-in zoom-in-95 duration-150">
              <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#b7004d] uppercase tracking-wide">
                  Wholesale SKU #{selectedProductForModal.id?.slice(0, 8)}
                </span>
                <button
                  onClick={() => setSelectedProductForModal(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square">
                    <img
                      src={Array.isArray(selectedProductForModal.images) ? selectedProductForModal.images[0] : (selectedProductForModal.images || '/placeholder.png')}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {selectedProductForModal.title || selectedProductForModal.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Supplier: <strong className="text-gray-800">{selectedProductForModal.supplierName || 'Verified Master Weaver'}</strong>
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Wholesale Unit Price</span>
                        <span className="text-xl font-black text-gray-900">₹{selectedProductForModal.price}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                        Zero MOQ (1 pc)
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-800 uppercase mb-1.5">Description & Sourcing Specs</h4>
                      <p className="text-xs text-gray-600 leading-relaxed max-h-32 overflow-y-auto">
                        {selectedProductForModal.description || 'Premium quality wholesale inventory manufactured to meet high e-commerce resale standards. Ready for immediate Delhivery express dispatch.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProductForModal(null);
                    handlePushOrder(selectedProductForModal);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#96003f] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Push Customer Order</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 3: 1-CLICK PUBLISH TO STORE CHANNEL */}
        {/* ======================================================== */}
        {syncProductModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSyncProductModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[82vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100 animate-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="shrink-0 p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#b7004d] text-white flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">1-Click Publish to Store</h3>
                    <p className="text-xs text-gray-500">Auto-push catalog item to your connected sales channel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSyncProductModal(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {syncSuccessResult ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-black text-emerald-900">Product Synced Successfully!</h4>
                    <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                      {syncSuccessResult.message}
                    </p>
                    <div className="p-3 bg-white rounded-xl text-left border border-emerald-100 text-xs space-y-1">
                      <div className="flex justify-between text-gray-500">
                        <span>Store Product ID:</span>
                        <span className="font-mono font-bold text-gray-800">{syncSuccessResult.syncedProductId}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Platform:</span>
                        <span className="font-bold text-gray-800">{syncSuccessResult.platform}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Domain:</span>
                        <span className="font-mono text-gray-800">{syncSuccessResult.storeDomain}</span>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => navigate('/dropshipper-integrations')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Live Webhook Logs</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSyncProductModal(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Product Preview */}
                    <div className="flex gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <img
                        src={Array.isArray(syncProductModal.images) ? syncProductModal.images[0] : (syncProductModal.images || syncProductModal.image || '')}
                        alt={syncProductModal.title || syncProductModal.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{syncProductModal.title || syncProductModal.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{syncProductModal.category?.name || syncProductModal.categorySlug || 'Fashion'}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="text-gray-500">Wholesale: <strong>₹{syncProductModal.price}</strong></span>
                          <span className="text-[#b7004d] font-bold">Store Price: ₹{computeProductMargins(syncProductModal).selling}</span>
                        </div>
                      </div>
                    </div>

                    {/* Channel Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Store Destination</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'Shopify Store', label: 'Shopify Store', badge: 'Connected' },
                          { id: 'WooCommerce Store', label: 'WooCommerce', badge: 'Active' }
                        ].map((ch) => (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => setSelectedChannel(ch.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedChannel === ch.id
                                ? 'border-[#b7004d] bg-pink-50/50 ring-1 ring-[#b7004d]'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800">{ch.label}</span>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                {ch.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 block">Auto-sync inventory & orders</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Profit Calculation Preview */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-1.5">
                      <div className="flex justify-between text-gray-600">
                        <span>Store Retail Listing Price:</span>
                        <span className="font-bold text-gray-900">₹{computeProductMargins(syncProductModal).selling}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Supplier Wholesale Base:</span>
                        <span className="text-gray-700">-₹{syncProductModal.price}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Est. Courier Shipping:</span>
                        <span className="text-gray-700">-₹60</span>
                      </div>
                      <div className="pt-1.5 border-t border-purple-200/60 flex justify-between font-black text-purple-900">
                        <span>Projected Profit Per Sale:</span>
                        <span className="text-emerald-700">+₹{computeProductMargins(syncProductModal).margin} ({computeProductMargins(syncProductModal).marginPct}%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pinned Action Buttons */}
              {!syncSuccessResult && (
                <div className="shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 bg-gray-50/95 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSyncProductModal(null)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSyncingChannel}
                    onClick={handleExecuteChannelSync}
                    className="px-5 py-2 rounded-xl bg-[#b7004d] hover:bg-[#96003f] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {isSyncingChannel ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Publishing to Store...</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Publish to Store Channel</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FLOATING QUICK EXPORT ACTION BAR (STEP 4) */}
        {/* ======================================================== */}
        {selectedProductIds.length > 0 && (
          <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 sm:gap-4 animate-in slide-in-from-bottom-5 duration-200 border border-gray-700 max-w-[95vw]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#b7004d] text-white flex items-center justify-center text-xs font-black shrink-0">
                {selectedProductIds.length}
              </span>
              <span className="text-xs font-bold whitespace-nowrap">Selected</span>
            </div>

            <div className="h-4 w-px bg-gray-700 shrink-0" />

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="bg-[#b7004d] hover:bg-[#92003d] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({selectedProductIds.length})</span>
            </button>

            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1-CLICK SHOPIFY / WOOCOMMERCE EXPORT MODAL (STEP 4) */}
        {/* ======================================================== */}
        <DropshipperCatalogExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          products={filteredProducts}
          selectedProducts={selectedProductObjects}
          marginConfig={marginConfig}
          storeName={dropshipperName}
        />

      </div>
    </DashboardLayout>
  );
}
