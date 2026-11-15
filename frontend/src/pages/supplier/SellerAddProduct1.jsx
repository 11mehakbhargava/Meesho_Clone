import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LogoutConfirmDialog from '../../components/ui/LogoutConfirmDialog';
import supplierApiService, { clearAuthSession, getCurrentSupplier } from '../../services/supplierApiService';
import { supabase } from '../../utils/supabase';
import { auth } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { SUPPLIER_MENU } from './supplierNavConfig';
import {
  PlusCircle,
  Package,
  Layers,
  Image as ImageIcon,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Eye,
  Box,
  Upload,
  Trash2,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Palette,
  Ruler,
  Check,
  X
} from 'lucide-react';

// Preset Color Swatches for Multi-Color Selector
const PRESET_COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Sky Blue', hex: '#38BDF8' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Pista Green', hex: '#93C572' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Baby Pink', hex: '#FBCFE8', border: true },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Beige', hex: '#D2B48C' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #f43f5e, #3b82f6, #10b981, #facc15)' }
];

// Category Adaptive Sizes
const CATEGORY_SIZES_MAP = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'],
  footwear: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  home: ['Single', 'Double', 'Queen', 'King', 'Standard', 'Pack of 1', 'Pack of 2', 'Pack of 4'],
  accessories: ['Adjustable', 'Free Size', 'Small', 'Medium', 'Large'],
  general: ['Standard', 'Free Size', 'Compact', 'Default'],
};

const getSizesForCategory = (categorySlug = '') => {
  const slug = (categorySlug || '').toLowerCase();
  if (slug.includes('footwear') || slug.includes('shoe') || slug.includes('sandal') || slug.includes('slipper') || slug.includes('heel')) {
    return CATEGORY_SIZES_MAP.footwear;
  }
  if (slug.includes('home') || slug.includes('kitchen') || slug.includes('bed') || slug.includes('curtain') || slug.includes('furnish') || slug.includes('living')) {
    return CATEGORY_SIZES_MAP.home;
  }
  if (slug.includes('jewel') || slug.includes('access') || slug.includes('watch') || slug.includes('bag') || slug.includes('belt')) {
    return CATEGORY_SIZES_MAP.accessories;
  }
  return CATEGORY_SIZES_MAP.apparel;
};

// Category Adaptive Thickness & Density Configuration
const CATEGORY_THICKNESS_MAP = {
  apparel: {
    unit: 'GSM',
    label: 'Fabric Thickness / Weight (GSM)',
    presets: ['140 GSM (Lightweight)', '180 GSM (Regular / Bio-Wash)', '220 GSM (Heavy / Premium)', '260 GSM (Fleece / Winter)', '300 GSM (Super Heavy)'],
  },
  home: {
    unit: 'GSM / mm',
    label: 'Material Thickness / Cushioning',
    presets: ['180 GSM (Standard)', '300 GSM (Heavy Cotton)', '400 GSM (Plush Towel)', '4 mm (Anti-Skid Mat)', '6 mm (Floor / Yoga Mat)', '8 mm (Cushioned Rug)'],
  },
  footwear: {
    unit: 'mm',
    label: 'Sole & Insole Cushion Thickness',
    presets: ['8 mm (Slim Sole)', '12 mm (Daily Wear)', '15 mm (Comfort Cushion)', '20 mm (Extra Soft Ortho)'],
  },
  kitchen: {
    unit: 'mm / Gauge',
    label: 'Gauge / Metal Wall Thickness',
    presets: ['1.2 mm (Standard)', '1.5 mm (Heavy Duty)', '2.0 mm (Tri-ply Base)', '2.5 mm (Commercial Grade)', '3.0 mm (Heavy Cast)'],
  },
  accessories: {
    unit: 'mm',
    label: 'Thickness / Wire Gauge',
    presets: ['1.0 mm (Delicate / Sleek)', '1.5 mm (Standard)', '2.0 mm (Medium)', '3.0 mm (Bold / Heavy)'],
  },
  general: {
    unit: 'mm / GSM',
    label: 'Thickness / Density Specification',
    presets: ['0.8 mm', '1.2 mm', '1.5 mm', '2.0 mm', '180 GSM', '250 GSM'],
  }
};

const getThicknessConfig = (categorySlug = '') => {
  const slug = (categorySlug || '').toLowerCase();
  if (slug.includes('footwear') || slug.includes('shoe') || slug.includes('sandal')) {
    return CATEGORY_THICKNESS_MAP.footwear;
  }
  if (slug.includes('kitchen') || slug.includes('cookware') || slug.includes('utensil')) {
    return CATEGORY_THICKNESS_MAP.kitchen;
  }
  if (slug.includes('home') || slug.includes('bed') || slug.includes('curtain') || slug.includes('mat') || slug.includes('rug')) {
    return CATEGORY_THICKNESS_MAP.home;
  }
  if (slug.includes('jewel') || slug.includes('access') || slug.includes('watch') || slug.includes('bangle')) {
    return CATEGORY_THICKNESS_MAP.accessories;
  }
  if (slug.includes('ethnic') || slug.includes('western') || slug.includes('apparel') || slug.includes('kurti') || slug.includes('saree') || slug.includes('shirt') || slug.includes('men') || slug.includes('women') || slug.includes('kid')) {
    return CATEGORY_THICKNESS_MAP.apparel;
  }
  return CATEGORY_THICKNESS_MAP.apparel;
};

// Client-side image compressor: Resizes device images to max 1280px & 0.75 JPEG quality (~90-150KB)
const compressImageFile = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(null);
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(readerEvent.target.result);
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export default function SellerAddProduct1({ onNavigate, embedded = false, onNavigateTab }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleNav = useCallback((path) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  }, [onNavigate, navigate]);

  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [isKycLoading, setIsKycLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categorySlug: '',
    customCategory: '',
    price: '',
    mrp: '',
    stock: '',
    sku: '',
  });

  // Category-adaptive Sizes State
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Available in Different Colors State
  const [selectedColors, setSelectedColors] = useState(['Black', 'Navy Blue', 'Maroon']);
  const [customColorInput, setCustomColorInput] = useState('');

  // Thickness State
  const [selectedThickness, setSelectedThickness] = useState('180 GSM (Regular / Bio-Wash)');
  const [customThicknessInput, setCustomThicknessInput] = useState('');

  // Multiple Images State: array of URLs or base64 strings
  const [images, setImages] = useState(['']);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // Fetch real categories, profile, and KYC compliance status
  useEffect(() => {
    const init = async () => {
      try {
        const [cats, prof, kyc] = await Promise.allSettled([
          supplierApiService.fetchCategories(),
          supplierApiService.fetchSupplierProfile(),
          supplierApiService.fetchSupplierKyc(),
        ]);

        if (cats.status === 'fulfilled' && cats.value) {
          const list = Array.isArray(cats.value) ? cats.value : [];
          setCategories(list);
          if (list.length > 0) {
            const firstSlug = list[0].slug || list[0].name;
            setFormData((prev) => ({ ...prev, categorySlug: firstSlug }));
            const catSizes = getSizesForCategory(firstSlug);
            setSelectedSizes(catSizes.slice(0, 4));
            const catThick = getThicknessConfig(firstSlug);
            if (catThick.presets.length > 0) {
              setSelectedThickness(catThick.presets[0]);
            }
          }
        }

        if (prof.status === 'fulfilled' && prof.value) {
          setProfile(prof.value);
        } else {
          setProfile(getCurrentSupplier());
        }

        if (kyc.status === 'fulfilled' && kyc.value) {
          setKycData(kyc.value);
        }
      } catch (err) {
        console.warn('Initialization notice:', err);
      } finally {
        setIsKycLoading(false);
      }
    };
    init();
  }, []);

  // Handlers for Category Change, Sizes, Colors & Thickness
  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    setFormData((prev) => ({ ...prev, categorySlug: slug }));
    if (slug !== 'CUSTOM') {
      const catSizes = getSizesForCategory(slug);
      setSelectedSizes(catSizes.slice(0, 4));
      const catThick = getThicknessConfig(slug);
      if (catThick.presets.length > 0) {
        setSelectedThickness(catThick.presets[0]);
      }
    }
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  const selectAllCategorySizes = () => {
    const available = getSizesForCategory(formData.categorySlug);
    setSelectedSizes(available);
  };

  const clearAllSizes = () => {
    setSelectedSizes([]);
  };

  const toggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const addCustomColor = () => {
    const trimmed = customColorInput.trim();
    if (trimmed && !selectedColors.includes(trimmed)) {
      setSelectedColors((prev) => [...prev, trimmed]);
      setCustomColorInput('');
    }
  };

  const removeColor = (colorName) => {
    setSelectedColors((prev) => prev.filter((c) => c !== colorName));
  };

  const selectThicknessPreset = (th) => {
    setSelectedThickness(th);
    setCustomThicknessInput('');
  };

  const handleCustomThicknessChange = (e) => {
    const val = e.target.value;
    setCustomThicknessInput(val);
    setSelectedThickness(val);
  };

  const handleTabChange = (tabId) => {
    if (onNavigateTab) return onNavigateTab(tabId);
    const item = SUPPLIER_MENU.find((m) => m.id === tabId);
    if (item?.path) handleNav(item.path);
  };

  const performLogout = async () => {
    try {
      if (supplierApiService?.logoutSupplier) await supplierApiService.logoutSupplier().catch(() => {});
      if (auth) await signOut(auth).catch(() => {});
    } catch (err) {
      console.warn(err);
    } finally {
      clearAuthSession();
      toast.success('Logged out successfully');
      handleNav('/supplier-login');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Multiple Images Handlers
  const handleImageUrlChange = (index, value) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addImageUrlSlot = () => {
    if (images.length >= 8) {
      toast.warning('Maximum 8 images allowed per product listing');
      return;
    }
    setImages((prev) => [...prev, '']);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length > 0 ? updated : [''];
    });
    if (activePreviewIndex >= index && activePreviewIndex > 0) {
      setActivePreviewIndex((prev) => prev - 1);
    }
  };

  const setAsCoverImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const [target] = updated.splice(index, 1);
      updated.unshift(target);
      return updated;
    });
    setActivePreviewIndex(0);
    toast.success('Selected image set as Primary Cover');
  };

  // File Upload Handler (device gallery / camera) with automatic compression
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.filter(Boolean).length + files.length > 8) {
      toast.warning('You can upload up to 8 images in total');
    }

    const toastId = toast.loading('Processing & optimizing image(s)...');
    const selectedFiles = files.slice(0, 8 - images.filter(Boolean).length);

    try {
      const compressedList = [];
      for (const file of selectedFiles) {
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" is not an image file`);
          continue;
        }
        const dataUrl = await compressImageFile(file);
        if (dataUrl) {
          compressedList.push(dataUrl);
        }
      }

      if (compressedList.length > 0) {
        setImages((prev) => {
          let updated = [...prev];
          for (const item of compressedList) {
            const emptyIdx = updated.findIndex((url) => !url.trim());
            if (emptyIdx !== -1) {
              updated[emptyIdx] = item;
            } else {
              updated.push(item);
            }
          }
          return updated;
        });
        toast.success(`Optimized and added ${compressedList.length} photo(s)!`, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (err) {
      console.warn('File upload compression notice:', err);
      toast.error('Failed to process one or more images', { id: toastId });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick Preset Loader
  const applyPreset = (presetImages) => {
    setImages([...presetImages]);
    setActivePreviewIndex(0);
    toast.success('Sample images applied to listing');
  };

  // Valid, non-empty images
  const validImages = images.map((u) => u.trim()).filter(Boolean);
  const currentPreviewImage = validImages[activePreviewIndex] || validImages[0] || '';

  const isKycVerified = Boolean(
    kycData?.isVerified ||
    kycData?.kyc?.status === 'APPROVED' ||
    (profile?.gstin && profile?.bankDetails)
  );
  const kycStatus = kycData?.kyc?.status || (isKycVerified ? 'APPROVED' : 'NOT_SUBMITTED');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isKycVerified) {
      toast.error('KYC Verification Required: You must complete business verification before publishing listings.');
      handleNav('/supplier-kyc1');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a product title');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid selling price');
      return;
    }
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = formData.categorySlug === 'CUSTOM'
        ? (formData.customCategory.trim() || 'General')
        : (formData.categorySlug || 'general');

      const finalImages = validImages.length > 0 ? validImages : [];

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceNum,
        mrp: formData.mrp ? parseFloat(formData.mrp) : Math.round(priceNum * 1.3),
        stock: stockNum,
        sku: formData.sku.trim() || `MSH-${Date.now().toString().slice(-6)}`,
        categorySlug: selectedCategory.toLowerCase().replace(/\s+/g, '-'),
        categoryName: selectedCategory,
        sizes: selectedSizes.length > 0 ? selectedSizes : ['Free Size'],
        colors: selectedColors,
        thickness: selectedThickness ? selectedThickness.trim() : null,
        thicknesses: selectedThickness ? [selectedThickness.trim()] : [],
        images: finalImages,
        imageUrl: finalImages[0] || '',
      };

      // 1. Submit product to backend API (handles file writing and deduplication)
      const createdProduct = await supplierApiService.createSupplierProduct(payload);

      // 2. Direct Supabase sync with the final images
      try {
        if (supabase) {
          const syncedImages = createdProduct?.images || payload.images;
          await supabase.from('products').insert([
            {
              title: payload.title,
              description: payload.description,
              price: payload.price,
              stock: payload.stock,
              images: syncedImages,
              category_slug: payload.categorySlug,
              sizes: payload.sizes,
              colors: payload.colors,
              thickness: payload.thickness,
              supplier_name: supplierDisplayName,
            }
          ]).select().catch(() => {});
        }
      } catch (sbErr) {
        console.warn('Supabase client insert note:', sbErr);
      }

      toast.success(`🎉 Product "${formData.title}" with ${finalImages.length} image(s) published successfully to live catalog!`);
      setTimeout(() => {
        handleNav('/supplier-inventory1');
      }, 600);
    } catch (err) {
      console.error('Failed to create product:', err);
      toast.error(err.message || 'Failed to publish product. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supplierDisplayName = profile?.storeName || profile?.fullName || profile?.name || 'Verified Supplier';

  const mainContent = (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Title */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-[#b7004d] text-xs font-bold tracking-wide uppercase mb-1">
              <PlusCircle className="w-3.5 h-3.5" />
              Listing Creation
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Add New Wholesale Product
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish a new merchandise listing into your live warehouse catalog with pricing, stock units, and multiple high-resolution images.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNav('/supplier-inventory1')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </button>
        </div>

        {/* Compliance KYC Gating Banner */}
        {!isKycLoading && !isKycVerified && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                    Compliance Lock
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    Status: {kycStatus === 'PENDING' ? 'Under Review ⏳' : kycStatus === 'REJECTED' ? 'Rejected ❌' : 'Not Submitted ⚠️'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  Business KYC Verification Required to Publish Products
                </h3>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  {kycStatus === 'PENDING' || kycStatus === 'UNDER_REVIEW'
                    ? 'Your KYC application is currently under review by our compliance team. Live catalog publishing will be unlocked upon approval.'
                    : kycStatus === 'REJECTED'
                    ? 'Your previous KYC verification was rejected. Please re-submit valid business documents in KYC Hub to unlock product publishing.'
                    : 'To comply with Indian E-Commerce Marketplace Regulations (GST Sec 9(5) & 194-O), suppliers must verify GSTIN, PAN and Bank Details before listing products.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNav('/supplier-kyc1')}
              className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition shrink-0 shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Complete KYC Now ➔</span>
            </button>
          </div>
        )}

        {/* 2-Column Form Layout with Real-Time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Column (8 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            {/* 1. Title */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Pure Cotton Floral Print Anarkali Kurti Set with Dupatta"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-11 px-4 text-xs font-medium rounded-2xl border border-slate-200 focus:border-[#d82a62] focus:ring-2 focus:ring-pink-100 outline-none transition"
                required
              />
            </div>

            {/* 2. Category & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Product Category
                </label>
                <select
                  name="categorySlug"
                  value={formData.categorySlug}
                  onChange={handleCategoryChange}
                  className="w-full h-11 px-3 text-xs font-semibold rounded-2xl border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.slug || c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="ethnic-wear">Ethnic Wear</option>
                  <option value="western-wear">Western Wear</option>
                  <option value="accessories">Jewellery & Accessories</option>
                  <option value="footwear">Footwear & Bags</option>
                  <option value="home-kitchen">Home & Kitchen</option>
                  <option value="CUSTOM">+ Add Custom Category</option>
                </select>

                {formData.categorySlug === 'CUSTOM' && (
                  <input
                    type="text"
                    name="customCategory"
                    placeholder="Type custom category name..."
                    value={formData.customCategory}
                    onChange={handleChange}
                    className="w-full h-10 px-3 mt-2 text-xs rounded-xl border border-pink-200 focus:border-[#d82a62] outline-none"
                    required
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  SKU Code (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g. ETH-KRT-042 (Optional)"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-xs font-mono rounded-2xl border border-slate-200 focus:border-[#d82a62] outline-none"
                />
              </div>
            </div>

            {/* 3. Pricing & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    name="price"
                    placeholder="799"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full h-11 pl-9 pr-3 text-xs font-bold rounded-2xl border border-slate-200 focus:border-[#d82a62] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  MRP / Strike Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    name="mrp"
                    placeholder="1299"
                    value={formData.mrp}
                    onChange={handleChange}
                    className="w-full h-11 pl-9 pr-3 text-xs font-medium rounded-2xl border border-slate-200 focus:border-[#d82a62] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Available Stock Units <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  placeholder="50"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-xs font-bold rounded-2xl border border-slate-200 focus:border-[#d82a62] outline-none"
                  required
                />
              </div>
            </div>

            {/* 4. PRODUCT SIZES (Category-Adaptive) */}
            <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#d82a62]" />
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Available Sizes & Dimensions ({selectedSizes.length} Selected)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click to select sizes tailored for <span className="font-bold text-slate-700 capitalize">{formData.categorySlug || 'this category'}</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllCategorySizes}
                    className="text-[11px] font-bold text-[#b7004d] hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={clearAllSizes}
                    className="text-[11px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Size Pills */}
              <div className="flex flex-wrap gap-2">
                {getSizesForCategory(formData.categorySlug).map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                        isSelected
                          ? 'bg-[#d82a62] text-white shadow-xs shadow-pink-600/25 ring-2 ring-pink-300'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-200 hover:bg-pink-50/30'
                      }`}
                    >
                      <span>{size}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Size Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom size (e.g. 4XL, 2.4, 2.6, 750ml, King Plus)..."
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSize();
                    }
                  }}
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#d82a62] outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="px-3.5 h-9 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold transition cursor-pointer shrink-0"
                >
                  + Add Size
                </button>
              </div>

              {selectedSizes.length === 0 && (
                <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>No size selected. "Free Size" will be assigned automatically.</span>
                </p>
              )}
            </div>

            {/* 5. PRODUCT COLORS (Available in Different Colors) */}
            <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#d82a62]" />
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Product Available in Different Colors ({selectedColors.length} Selected)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select all shade options available in your warehouse inventory.
                  </p>
                </div>
              </div>

              {/* Color Swatch Circles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {PRESET_COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColor(col.name)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                        isSelected
                          ? 'border-[#d82a62] bg-pink-50/60 shadow-xs ring-1 ring-pink-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 shadow-xs flex items-center justify-center ${
                          col.border ? 'border border-slate-300' : ''
                        }`}
                        style={{ background: col.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-2.5 h-2.5 ${col.name === 'White' || col.name === 'Yellow' || col.name === 'Baby Pink' ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom color shade (e.g. Wine Red, Bottle Green, Peach, Mustard)..."
                  value={customColorInput}
                  onChange={(e) => setCustomColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomColor();
                    }
                  }}
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:border-[#d82a62] outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3.5 h-9 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold transition cursor-pointer shrink-0"
                >
                  + Add Color
                </button>
              </div>

              {/* Selected Colors Chip Tray */}
              {selectedColors.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Active Variants:</span>
                  {selectedColors.map((col) => {
                    const preset = PRESET_COLORS.find((p) => p.name.toLowerCase() === col.toLowerCase());
                    return (
                      <span
                        key={col}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ background: preset?.hex || '#6366f1' }}
                        />
                        <span>{col}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(col)}
                          className="hover:text-rose-600 cursor-pointer ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. PRODUCT THICKNESS & FABRIC GSM */}
            <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d82a62]" />
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      {getThicknessConfig(formData.categorySlug).label}
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Thickness / GSM helps buyers evaluate premium feel, durability, and fabric weight.
                  </p>
                </div>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {getThicknessConfig(formData.categorySlug).presets.map((th) => {
                  const isSelected = selectedThickness === th;
                  return (
                    <button
                      key={th}
                      type="button"
                      onClick={() => selectThicknessPreset(th)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#d82a62] text-white shadow-xs ring-2 ring-pink-300'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-200 hover:bg-pink-50/30'
                      }`}
                    >
                      {th}
                    </button>
                  );
                })}
              </div>

              {/* Custom Thickness Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Selected / Custom Thickness
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 180 GSM, 1.5 mm, 2.0 mm, 300 GSM..."
                    value={selectedThickness}
                    onChange={handleCustomThicknessChange}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-[#d82a62] outline-none"
                  />
                </div>
                <div className="flex items-end pb-1 text-[11px] text-slate-500">
                  <span>Unit: {getThicknessConfig(formData.categorySlug).unit} (Auto-aligned with {formData.categorySlug || 'product'})</span>
                </div>
              </div>
            </div>

            {/* 4. MULTIPLE PRODUCT IMAGES & MEDIA SECTION */}
            <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d82a62]" />
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Product Images Gallery ({validImages.length}/8)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Add multiple high-resolution photos (Front, Back, Close-up, Lifestyle).
                  </p>
                </div>

                {/* Upload & Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:border-[#d82a62] hover:text-[#d82a62] text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={addImageUrlSlot}
                    disabled={images.length >= 8}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#d82a62] text-white hover:bg-[#b7004d] text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Image Input Rows */}
              <div className="space-y-2.5">
                {images.map((url, idx) => {
                  const isCover = idx === 0;
                  const isValid = Boolean(url && url.trim());

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border transition ${
                        isCover ? 'border-pink-300 shadow-xs ring-1 ring-pink-100' : 'border-slate-200'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                        {isValid ? (
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                        {isCover && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#d82a62] text-white text-[8px] font-black text-center py-0.5 leading-none uppercase">
                            Cover
                          </span>
                        )}
                      </div>

                      {/* URL Input */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {isCover ? 'Primary Cover Photo' : `Gallery Image #${idx + 1}`}
                          </span>
                          {!isCover && isValid && (
                            <button
                              type="button"
                              onClick={() => setAsCoverImage(idx)}
                              className="text-[10px] font-bold text-[#b7004d] hover:underline cursor-pointer inline-flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                              <span>Set as Cover</span>
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder={isCover ? 'Enter primary image URL or upload above...' : `Enter gallery photo #${idx + 1} URL...`}
                          value={url}
                          onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                          className="w-full h-8 px-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#d82a62] outline-none transition"
                        />
                      </div>

                      {/* Delete Button */}
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="w-8 h-8 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition shrink-0 cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add more button */}
              {images.length < 8 && (
                <button
                  type="button"
                  onClick={addImageUrlSlot}
                  className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-pink-300 hover:bg-pink-50/40 text-slate-600 hover:text-[#b7004d] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Another Product Image ({images.length}/8)</span>
                </button>
              )}
            </div>

            {/* 5. Description */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Product Description & Specifications
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Include fabric details, dimensions, pack contents, washing instructions, etc."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 text-xs font-medium rounded-2xl border border-slate-200 focus:border-[#d82a62] outline-none transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {!isKycLoading && !isKycVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    toast.error('Complete business KYC verification first to unlock product publishing.');
                    handleNav('/supplier-kyc1');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Listing Locked: Complete Business KYC to Publish ➔</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d82a62] to-[#eb3678] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-pink-600/25 transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>{isSubmitting ? 'Publishing Listing...' : `Publish Product to Catalog (${validImages.length} Image${validImages.length === 1 ? '' : 's'})`}</span>
                </button>
              )}
            </div>
          </form>

          {/* Real-Time Live Preview Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#b7004d]" />
                  <span>Real-Time Catalog Preview</span>
                </div>
                {validImages.length > 1 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#b7004d]">
                    {validImages.length} Photos
                  </span>
                )}
              </div>

              {/* Card Rendering with Multiple Photos Preview */}
              <div className="rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs bg-white">
                {/* Main Image Display */}
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden group">
                  {currentPreviewImage ? (
                    <img
                      src={currentPreviewImage}
                      alt="Catalog Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 flex flex-col items-center">
                      <Box className="w-8 h-8 mb-1 opacity-50" />
                      <span className="text-[11px]">Product Photo Preview</span>
                    </div>
                  )}

                  {/* Stock Tag */}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-emerald-700 shadow-xs">
                    {Number(formData.stock || 0) > 0 ? 'In Stock' : 'Draft'}
                  </span>

                  {/* Multiple Images Counter Badge */}
                  {validImages.length > 1 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                      {activePreviewIndex + 1} / {validImages.length}
                    </span>
                  )}
                </div>

                {/* Multiple Images Thumbnail Strip */}
                {validImages.length > 1 && (
                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                    {validImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePreviewIndex(i)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                          activePreviewIndex === i
                            ? 'border-[#d82a62] scale-105 shadow-xs'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-[#b7004d] uppercase tracking-wide bg-pink-50 px-2 py-0.5 rounded-full">
                      {formData.categorySlug || 'Category'}
                    </span>
                    {selectedThickness && (
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-slate-200">
                        <Ruler className="w-2.5 h-2.5 text-slate-500" />
                        <span>{selectedThickness}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                    {formData.title || 'Product Title Appears Here'}
                  </h4>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-base font-black text-slate-900">
                      ₹{formData.price ? Number(formData.price).toLocaleString('en-IN') : '0.00'}
                    </span>
                    {formData.mrp && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(formData.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Real-Time Selected Colors Preview */}
                  {selectedColors.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Available Colors:</span>
                        <span className="text-[10px] font-semibold text-slate-400">{selectedColors.length} Shade{selectedColors.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedColors.map((col) => {
                          const preset = PRESET_COLORS.find((p) => p.name.toLowerCase() === col.toLowerCase());
                          return (
                            <span
                              key={col}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full"
                              title={col}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                style={{ background: preset?.hex || '#6366f1' }}
                              />
                              <span>{col}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Real-Time Selected Sizes Preview */}
                  {selectedSizes.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Sizes:</span>
                        <span className="text-[10px] font-semibold text-slate-400">{selectedSizes.length} Size{selectedSizes.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {selectedSizes.map((sz) => (
                          <span
                            key={sz}
                            className="text-[10px] font-bold text-[#b7004d] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 line-clamp-2 pt-1 border-t border-slate-100">
                    {formData.description || 'Product specifications and details will appear here.'}
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-[11px] text-[#880e4f] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#d82a62]" />
                  <span>Instant Multi-Image Catalog:</span>
                </div>
                <p className="text-pink-900/80 leading-relaxed">
                  All photos sync directly to the customer product page carousel and warehouse dropship inventory in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <DashboardLayout
      menuItems={SUPPLIER_MENU}
      activeTab="add-product"
      onTabChange={handleTabChange}
      roleName="SUPPLIER"
      userName={supplierDisplayName}
      onLogout={() => setShowLogoutConfirm(true)}
    >
      {mainContent}

      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        setIsOpen={setShowLogoutConfirm}
        roleLabel="Supplier"
        onConfirm={performLogout}
      />
    </DashboardLayout>
  );
}
