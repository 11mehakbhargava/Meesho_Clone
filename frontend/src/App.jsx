import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Reseller & Fintech Pages (Shruti Branch)
import HomeUserReseller from './pages/Reseller Earnings & Wallets/HomeUserReseller';
import ShareEarnConfig from './pages/Reseller Earnings & Wallets/ShareEarnConfig';
import AffiliateProgram from './pages/Reseller Earnings & Wallets/AffiliateProgram';
import AffiliateProgramPanel from './pages/Reseller Earnings & Wallets/AffiliateProgramPanel';
import MyWalletFintechStyle from './pages/Reseller Earnings & Wallets/MyWalletFintechStyle';
import CommunityHub from './pages/Reseller Earnings & Wallets/CommunityHub';
import PayoutSettings from './pages/Reseller Earnings & Wallets/PayoutSettings';
import PayoutConfirmation from './pages/Reseller Earnings & Wallets/PayoutConfirmation';
import NotificationCenter from './pages/Reseller Earnings & Wallets/NotificationCenter';
import ConversationScreen from './pages/Reseller Earnings & Wallets/ConversationScreen';
import MeeshoMessengerChatHub from './pages/Reseller Earnings & Wallets/MeeshoMessengerChatHub';
import LoginSignup from './pages/Reseller Earnings & Wallets/LoginSignup';
import ReferEarn from './pages/Reseller Earnings & Wallets/ReferEarn';
import ResellEarn from './pages/Reseller Earnings & Wallets/ResellEarn';
import EarningsDashboard1 from './pages/Reseller Earnings & Wallets/EarningsDashboard1';
import EarningsDashboard2 from './pages/Reseller Earnings & Wallets/EarningsDashboard2';
import ResellerWallet from './pages/Reseller Earnings & Wallets/ResellerWallet';
import WithdrawEarnings from './pages/Reseller Earnings & Wallets/WithdrawEarnings';

// Customer & Reseller Shopping Pages
import HomeScreenFlutterLuxe from './pages/customer & Reseller/home_screen_flutter_luxe';
import FlashSaleLandingPage from './pages/customer & Reseller/flash_sale_landing_page';
import CuratedSpotlight from './pages/customer & Reseller/curated_spotlight';
import SearchCategoriesExplorer from './pages/customer & Reseller/search_categories_explorer';
import SearchResults from './pages/customer & Reseller/search_results';
import SareesCategoryListing from './pages/customer & Reseller/sarees_category_listing';
import WomenWesternCategory from './pages/customer & Reseller/women_western_category';
import ProductDetail from './pages/customer & Reseller/product_detail';
import RatingsReviews from './pages/customer & Reseller/ratings_reviews';
import WriteAReview from './pages/customer & Reseller/write_a_review';
import UserWishlist from './pages/customer & Reseller/user_wishlist';
import ShoppingCart from './pages/customer & Reseller/shopping_cart';
import CheckoutAddressSelection from './pages/customer & Reseller/checkout_address_selection';
import CheckoutPayment from './pages/customer & Reseller/checkout_payment';
import UserWebDashboard from './pages/customer & Reseller/user_web_dashboard';

// Delivery & Driver Logistics Pages
import DriverDashboardMobile from './pages/delivery & driver logistics/driver_dashboard_mobile';
import AvailableTasks from './pages/delivery & driver logistics/available_tasks';
import OrderDetailsDriver from './pages/delivery & driver logistics/order_details_driver';
import ActiveDeliveryMobile from './pages/delivery & driver logistics/active_delivery_mobile';
import DeliveryHistoryMobile from './pages/delivery & driver logistics/delivery_history_mobile';
import DriverEarningsMobile from './pages/delivery & driver logistics/driver_earnings_mobile';
import RiderExpressDashboard from './pages/delivery & driver logistics/rider_express_dashboard';
import MeeshoVelocity from './pages/delivery & driver logistics/meesho_velocity';
import SwiftRoute from './pages/delivery & driver logistics/swiftroute';

// Supplier Hub Pages
import SupplierDashboard2 from './pages/supplier/supplier_dashboard2';
import SupplierDashboard1 from './pages/supplier/supplier_dashboard1';
import SupplierInventoryManagement from './pages/supplier/supplier_inventory_management';
import SupplierOrdersList from './pages/supplier/supplier_orders_list';
import SupplierProfile from './pages/supplier/supplier_profile';
import AddNewProductSupplier from './pages/supplier/add_new_product_supplier';
import AddCategorySupplier from './pages/supplier/add_category_supplier';
import SellerWebDashboard from './pages/supplier/seller_web_dashboard';

// Admin Panel Pages
import AdminWebPanel from './pages/admin_panel/admin_web_panel';
import AdminProductCatalog from './pages/admin_panel/admin_product_catalog';
import CampaignCreationFlowAdmin from './pages/admin_panel/campaign_creation_flow_admin';
import PerformanceAnalyticsDashboardAdmin from './pages/admin_panel/performance_analytics_dashboard_admin';

// Support & Ticketing Pages
import SupportCenter from './pages/Community_Social_Chat_&_Customer_Support/support_center';
import RaiseATicket from './pages/Community_Social_Chat_&_Customer_Support/raise_a_ticket';

// Design Ecosystem & Theme Variations
import TheDigitalCuratorEcosystem from './pages/Design_Ecosystem_&_Theme_Variations/the_digital_curator_ecosystem';
import PetalCollective from './pages/Design_Ecosystem_&_Theme_Variations/petal_collective';
import GildedPulse from './pages/Design_Ecosystem_&_Theme_Variations/gilded_pulse';
import SocialCommerceLuxe from './pages/Design_Ecosystem_&_Theme_Variations/social_commerce_luxe';
import SignalCore from './pages/Design_Ecosystem_&_Theme_Variations/signal_core';
import StructureFlow from './pages/Design_Ecosystem_&_Theme_Variations/structure_flow';

// Screen Catalog for Floating Navigator
const screenCatalog = [
  // 1. Reseller & Fintech 
  { path: '/', name: 'Reseller Home', icon: '🛍️', group: 'Reseller & Shop' },
  { path: '/resell-earn', name: 'Resell & Earn', icon: '💰', group: 'Reseller & Shop' },
  { path: '/share-earn-config', name: 'Share & Earn Config', icon: '🔗', group: 'Reseller & Shop' },
  { path: '/earnings-dashboard-1', name: 'Earnings Dashboard 1', icon: '📈', group: 'Reseller & Shop' },
  { path: '/earnings-dashboard-2', name: 'Earnings Analytics 2', icon: '📊', group: 'Reseller & Shop' },
  { path: '/my-wallet', name: 'Fintech Wallet', icon: '👛', group: 'Reseller & Shop' },
  { path: '/reseller-wallet', name: 'Reseller Wallet', icon: '💳', group: 'Reseller & Shop' },
  { path: '/withdraw-earnings', name: 'Withdraw Earnings', icon: '🏦', group: 'Reseller & Shop' },
  { path: '/payout-settings', name: 'Payout Settings', icon: '⚙️', group: 'Reseller & Shop' },
  { path: '/payout-confirmation', name: 'Payout Confirmation', icon: '✅', group: 'Reseller & Shop' },
  { path: '/refer-earn', name: 'Refer & Earn', icon: '🎁', group: 'Reseller & Shop' },
  { path: '/affiliate-program', name: 'Affiliate Program', icon: '🤝', group: 'Reseller & Shop' },
  { path: '/affiliate-panel', name: 'Affiliate Panel', icon: '👑', group: 'Reseller & Shop' },
  { path: '/community-hub', name: 'Community Hub', icon: '👥', group: 'Reseller & Shop' },
  { path: '/messenger', name: 'Messenger Hub', icon: '💬', group: 'Reseller & Shop' },
  { path: '/conversation', name: 'Conversation Screen', icon: '🗨️', group: 'Reseller & Shop' },
  { path: '/notifications', name: 'Notification Center', icon: '🔔', group: 'Reseller & Shop' },
  { path: '/login', name: 'Login / Sign Up', icon: '🔐', group: 'Reseller & Shop' },

  // 2. Customer Shopping Flow
  { path: '/product', name: 'Product Detail', icon: '🏷️', group: 'Shopping' },
  { path: '/cart', name: 'Shopping Cart', icon: '🛒', group: 'Shopping' },
  { path: '/address', name: 'Checkout Address', icon: '📍', group: 'Shopping' },
  { path: '/payment', name: 'Checkout Payment', icon: '💳', group: 'Shopping' },
  { path: '/wishlist', name: 'User Wishlist', icon: '❤️', group: 'Shopping' },
  { path: '/explorer', name: 'Categories Explorer', icon: '🗂️', group: 'Shopping' },
  { path: '/search', name: 'Search Results', icon: '🔍', group: 'Shopping' },
  { path: '/sarees', name: 'Sarees Listing', icon: '🥻', group: 'Shopping' },
  { path: '/western', name: 'Women Western', icon: '👗', group: 'Shopping' },
  { path: '/spotlight', name: 'Curated Spotlight', icon: '🌟', group: 'Shopping' },
  { path: '/flash', name: 'Flash Sale Landing', icon: '⚡', group: 'Shopping' },
  { path: '/luxe', name: 'Flutter Luxe Theme', icon: '✨', group: 'Shopping' },
  { path: '/reviews', name: 'Ratings & Reviews', icon: '⭐', group: 'Shopping' },
  { path: '/write-review', name: 'Write a Review', icon: '✍️', group: 'Shopping' },
  { path: '/user-dashboard', name: 'Curator Web Dashboard', icon: '📊', group: 'Shopping' },

  // 3. Logistics & Driver Fleet
  { path: '/driver-dashboard', name: 'Driver Dashboard', icon: '🛵', group: 'Logistics' },
  { path: '/available-tasks', name: 'Available Tasks', icon: '📦', group: 'Logistics' },
  { path: '/order-driver', name: 'Order Details Driver', icon: '📋', group: 'Logistics' },
  { path: '/active-delivery', name: 'Active Delivery Map', icon: '🗺️', group: 'Logistics' },
  { path: '/delivery-history', name: 'Delivery History', icon: '📜', group: 'Logistics' },
  { path: '/driver-earnings', name: 'Driver Earnings', icon: '💰', group: 'Logistics' },
  { path: '/rider-express', name: 'Rider Express', icon: '⚡', group: 'Logistics' },
  { path: '/meesho-velocity', name: 'Meesho Velocity', icon: '🚀', group: 'Logistics' },
  { path: '/swiftroute', name: 'SwiftRoute AI', icon: '🧭', group: 'Logistics' },

  // 4. Supplier Hub
  { path: '/structure-flow', name: 'Structure Flow Hub', icon: '🏬', group: 'Supplier' },
  { path: '/supplier-dashboard-2', name: 'Supplier Dashboard 2', icon: '📈', group: 'Supplier' },
  { path: '/supplier-dashboard-1', name: 'Supplier Dashboard 1', icon: '📉', group: 'Supplier' },
  { path: '/supplier-inventory', name: 'Inventory Management', icon: '📦', group: 'Supplier' },
  { path: '/supplier-orders', name: 'Supplier Orders List', icon: '📑', group: 'Supplier' },
  { path: '/add-product', name: 'Add New Product', icon: '➕', group: 'Supplier' },
  { path: '/add-category', name: 'Add Category', icon: '🏷️', group: 'Supplier' },
  { path: '/supplier-profile', name: 'Supplier Profile', icon: '👤', group: 'Supplier' },
  { path: '/seller-dashboard', name: 'Seller Web Dashboard', icon: '💻', group: 'Supplier' },

  // 5. Admin Panel & Support
  { path: '/admin-panel', name: 'Admin Web Panel', icon: '🛡️', group: 'Admin' },
  { path: '/admin-catalog', name: 'Admin Catalog', icon: '📁', group: 'Admin' },
  { path: '/campaign-flow', name: 'Campaign Creation', icon: '📢', group: 'Admin' },
  { path: '/admin-analytics', name: 'Performance Analytics', icon: '📊', group: 'Admin' },
  { path: '/support-center', name: 'Support Center', icon: '🎧', group: 'Admin' },
  { path: '/raise-ticket', name: 'Raise A Ticket', icon: '🎫', group: 'Admin' },

  // 6. Themes & Design Ecosystem
  { path: '/digital-curator', name: 'Digital Curator', icon: '🎨', group: 'Themes' },
  { path: '/petal-collective', name: 'Petal Collective', icon: '🌸', group: 'Themes' },
  { path: '/gilded-pulse', name: 'Gilded Pulse', icon: '👑', group: 'Themes' },
  { path: '/social-commerce-luxe', name: 'Social Commerce Luxe', icon: '💎', group: 'Themes' },
  { path: '/signal-core', name: 'Signal Core', icon: '⚡', group: 'Themes' },
];

function FloatingNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const groups = ['All', 'Reseller & Shop', 'Shopping', 'Logistics', 'Supplier', 'Admin', 'Themes'];
  const filteredScreens = screenCatalog.filter((s) => {
    if (selectedGroup === 'All') return true;
    return s.group === selectedGroup;
  });

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-screen-navigator', handleOpen);
    return () => window.removeEventListener('open-screen-navigator', handleOpen);
  }, []);

  const isHome = location.pathname === '/' || location.pathname === '/reseller-home';

  return (
    <>
      {/* Slide-over Modal / Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999998] flex items-center justify-end p-3 sm:pr-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-950/95 backdrop-blur-xl text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-[#b90041] max-w-[95vw] sm:max-w-lg w-full max-h-[85vh] flex flex-col animate-in zoom-in-95 slide-in-from-right-4 duration-200"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b90041] animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                  Screens Catalog ({screenCatalog.length} Pages)
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                aria-label="Close Navigator"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {groups.map((group) => {
                const count =
                  group === 'All'
                    ? screenCatalog.length
                    : screenCatalog.filter((s) => s.group === group).length;
                return (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${selectedGroup === group
                        ? 'bg-[#b90041] text-white shadow-md shadow-pink-500/30'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                      }`}
                  >
                    {group} ({count})
                  </button>
                );
              })}
            </div>

            {/* Screen List Grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {filteredScreens.map((screen) => {
                const isActive = location.pathname === screen.path;
                return (
                  <button
                    key={screen.path}
                    onClick={() => {
                      navigate(screen.path);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${isActive
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 scale-[1.02]'
                        : 'bg-gray-900/90 text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <span className="text-sm">{screen.icon}</span>
                    <span className="truncate">{screen.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Router Bridge Component
function AppRoutes() {
  const navigate = useNavigate();

  // Helper navigate prop for legacy components expecting onNavigate/onBack
  const handleNav = (pathOrId) => {
    const routeMap = {
      // Customer
      reseller: '/',
      home: '/',
      cart: '/cart',
      wishlist: '/wishlist',
      checkout: '/address',
      address: '/address',
      payment: '/payment',
      product: '/product',
      reviews: '/reviews',
      write_review: '/write-review',
      explorer: '/explorer',
      categories: '/explorer',
      search: '/search',
      sarees: '/sarees',
      western: '/western',
      spotlight: '/spotlight',
      flash: '/flash',
      luxe: '/luxe',
      user_dashboard: '/user-dashboard',

      // Reseller & Fintech
      'resell-earn': '/resell-earn',
      'share-earn-config': '/share-earn-config',
      'earnings-dashboard-1': '/earnings-dashboard-1',
      'earnings-dashboard-2': '/earnings-dashboard-2',
      'my-wallet': '/my-wallet',
      'reseller-wallet': '/reseller-wallet',
      'withdraw-earnings': '/withdraw-earnings',
      'payout-settings': '/payout-settings',
      'payout-confirmation': '/payout-confirmation',
      'refer-earn': '/refer-earn',
      'affiliate-program': '/affiliate-program',
      'affiliate-panel': '/affiliate-panel',

      // Logistics
      driver_dashboard: '/driver-dashboard',
      available_tasks: '/available-tasks',
      order_driver: '/order-driver',
      active_delivery: '/active-delivery',
      delivery_history: '/delivery-history',
      driver_earnings: '/driver-earnings',
      rider_express: '/rider-express',
      meesho_velocity: '/meesho-velocity',
      swiftroute: '/swiftroute',

      // Supplier
      structureFlow: '/structure-flow',
      dashboard2: '/supplier-dashboard-2',
      dashboard1: '/supplier-dashboard-1',
      inventory: '/supplier-inventory',
      orders: '/supplier-orders',
      addProduct: '/add-product',
      addCategory: '/add-category',
      profile: '/supplier-profile',
      webDashboard: '/seller-dashboard',

      // Admin & Community
      adminPanel: '/admin-panel',
      adminCatalog: '/admin-catalog',
      campaignFlow: '/campaign-flow',
      adminAnalytics: '/admin-analytics',
      communityHub: '/community-hub',
      messenger: '/messenger',
      chatScreen: '/conversation',
      supportCenter: '/support-center',
      raiseTicket: '/raise-ticket',
      notifications: '/notifications',
      login: '/login',

      // Themes
      digitalCurator: '/digital-curator',
      petalCollective: '/petal-collective',
      gildedPulse: '/gilded-pulse',
      socialCommerceLuxe: '/social-commerce-luxe',
      signalCore: '/signal-core',
    };

    const target = routeMap[pathOrId] || pathOrId;
    if (target.startsWith('/')) {
      navigate(target);
    } else {
      navigate(`/${target}`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fb]">
      <FloatingNavigator />

      <Routes>
        {/* Reseller & Fintech Routes (Shruti Flow) */}
        <Route path="/reseller-home" element={<HomeUserReseller />} />
        <Route path="/share-earn-config" element={<ShareEarnConfig />} />
        <Route path="/resell-earn" element={<ResellEarn />} />
        <Route path="/earnings-dashboard-1" element={<EarningsDashboard1 />} />
        <Route path="/earnings-dashboard-2" element={<EarningsDashboard2 />} />
        <Route path="/refer-earn" element={<ReferEarn />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        <Route path="/affiliate-panel" element={<AffiliateProgramPanel />} />
        <Route path="/my-wallet" element={<MyWalletFintechStyle />} />
        <Route path="/reseller-wallet" element={<ResellerWallet />} />
        <Route path="/withdraw-earnings" element={<WithdrawEarnings />} />
        <Route path="/payout-settings" element={<PayoutSettings />} />
        <Route path="/payout-confirmation" element={<PayoutConfirmation />} />
        <Route path="/community-hub" element={<CommunityHub />} />
        <Route path="/messenger" element={<MeeshoMessengerChatHub />} />
        <Route path="/conversation" element={<ConversationScreen />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/" element={<LoginSignup />} />
        <Route path="/login" element={<LoginSignup />} />


        {/* Customer Shopping Routes */}
        <Route path="/product" element={<ProductDetail onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/cart" element={<ShoppingCart onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/address" element={<CheckoutAddressSelection onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/payment" element={<CheckoutPayment onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/wishlist" element={<UserWishlist onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/explorer" element={<SearchCategoriesExplorer onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/categories" element={<SearchCategoriesExplorer onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/search" element={<SearchResults onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/sarees" element={<SareesCategoryListing onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/western" element={<WomenWesternCategory onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/spotlight" element={<CuratedSpotlight onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/flash" element={<FlashSaleLandingPage onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/luxe" element={<HomeScreenFlutterLuxe onNavigate={handleNav} />} />
        <Route path="/reviews" element={<RatingsReviews onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/write-review" element={<WriteAReview onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/user-dashboard" element={<UserWebDashboard onNavigate={handleNav} onBack={handleBack} />} />

        {/* Logistics & Driver Fleet Routes */}
        <Route path="/driver-dashboard" element={<DriverDashboardMobile onNavigate={handleNav} />} />
        <Route path="/available-tasks" element={<AvailableTasks onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/order-driver" element={<OrderDetailsDriver onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/active-delivery" element={<ActiveDeliveryMobile onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/delivery-history" element={<DeliveryHistoryMobile onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/driver-earnings" element={<DriverEarningsMobile onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/rider-express" element={<RiderExpressDashboard onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/meesho-velocity" element={<MeeshoVelocity onNavigate={handleNav} onBack={handleBack} />} />
        <Route path="/swiftroute" element={<SwiftRoute onNavigate={handleNav} onBack={handleBack} />} />

        {/* Supplier Hub Routes */}
        <Route
          path="/structure-flow"
          element={
            <StructureFlow
              onNavigate={handleNav}
              onAddNewProduct={() => handleNav('/add-product')}
              onViewInventory={() => handleNav('/supplier-inventory')}
              onViewOrders={() => handleNav('/supplier-orders')}
            />
          }
        />
        <Route
          path="/supplier-dashboard-2"
          element={
            <SupplierDashboard2
              onAddNewProduct={() => handleNav('/add-product')}
              onViewInventory={() => handleNav('/supplier-inventory')}
              onViewAllOrders={() => handleNav('/supplier-orders')}
              onNavChange={(tabId) => handleNav(tabId)}
            />
          }
        />
        <Route
          path="/supplier-dashboard-1"
          element={
            <SupplierDashboard1
              onNavigate={handleNav}
              onShipNow={() => handleNav('/supplier-orders')}
              onClaimCredit={() => handleNav('/admin-analytics')}
            />
          }
        />
        <Route
          path="/supplier-inventory"
          element={<SupplierInventoryManagement onNavigate={handleNav} onAddProduct={() => handleNav('/add-product')} />}
        />
        <Route path="/supplier-orders" element={<SupplierOrdersList onBack={handleBack} onNavigate={handleNav} />} />
        <Route
          path="/add-product"
          element={
            <AddNewProductSupplier
              onBack={handleBack}
              onPublish={() => handleNav('/supplier-inventory')}
              onSaveDraft={() => handleNav('/supplier-inventory')}
            />
          }
        />
        <Route
          path="/add-category"
          element={<AddCategorySupplier onBack={handleBack} onSaveCategory={() => handleNav('/supplier-inventory')} />}
        />
        <Route
          path="/supplier-profile"
          element={<SupplierProfile onBack={handleBack} onNavigate={handleNav} onLogout={() => handleNav('/')} />}
        />
        <Route
          path="/seller-dashboard"
          element={
            <SellerWebDashboard
              onNavigate={handleNav}
              onViewProducts={() => handleNav('/supplier-inventory')}
              onViewOrders={() => handleNav('/supplier-orders')}
            />
          }
        />

        {/* Admin Panel & Support Routes */}
        <Route
          path="/admin-panel"
          element={<AdminWebPanel onNavigate={handleNav} onSwitchView={() => handleNav('/seller-dashboard')} />}
        />
        <Route
          path="/admin-catalog"
          element={<AdminProductCatalog onNavigate={handleNav} onAddNewProduct={() => handleNav('/add-product')} />}
        />
        <Route
          path="/campaign-flow"
          element={<CampaignCreationFlowAdmin onNavigate={handleNav} onCancel={() => handleNav('/admin-panel')} />}
        />
        <Route path="/admin-analytics" element={<PerformanceAnalyticsDashboardAdmin onNavigate={handleNav} />} />
        <Route
          path="/support-center"
          element={<SupportCenter onNavigate={handleNav} onOpenChat={() => handleNav('/conversation')} />}
        />
        <Route path="/raise-ticket" element={<RaiseATicket onBack={handleBack} onNavigate={handleNav} />} />

        {/* Theme Variations Routes */}
        <Route path="/digital-curator" element={<TheDigitalCuratorEcosystem onNavigate={handleNav} />} />
        <Route path="/petal-collective" element={<PetalCollective onNavigate={handleNav} onLoginSuccess={() => handleNav('/digital-curator')} />}
        />
        <Route path="/gilded-pulse" element={<GildedPulse onNavigate={handleNav} />} />
        <Route path="/social-commerce-luxe" element={<SocialCommerceLuxe onNavigate={handleNav} />} />
        <Route path="/signal-core" element={<SignalCore onNavigate={handleNav} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
