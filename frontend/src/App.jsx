import React, { useState } from 'react';

// Customer & Reseller Screens
import HomeUserReseller from './pages/customer & Reseller/home_user_reseller';
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

// Delivery & Driver Logistics Screens
import DriverDashboardMobile from './pages/delivery & driver logistics/driver_dashboard_mobile';
import AvailableTasks from './pages/delivery & driver logistics/available_tasks';
import OrderDetailsDriver from './pages/delivery & driver logistics/order_details_driver';
import ActiveDeliveryMobile from './pages/delivery & driver logistics/active_delivery_mobile';
import DeliveryHistoryMobile from './pages/delivery & driver logistics/delivery_history_mobile';
import DriverEarningsMobile from './pages/delivery & driver logistics/driver_earnings_mobile';
import RiderExpressDashboard from './pages/delivery & driver logistics/rider_express_dashboard';

// Supplier Hub Screens
import SupplierDashboard2 from './supplier/supplier_dashboard2';
import SupplierDashboard1 from './supplier/supplier_dashboard1';
import SupplierInventoryManagement from './supplier/supplier_inventory_management';
import SupplierOrdersList from './supplier/supplier_orders_list';
import SupplierProfile from './supplier/supplier_profile';
import AddNewProductSupplier from './supplier/add_new_product_supplier';
import AddCategorySupplier from './supplier/add_category_supplier';
import SellerWebDashboard from './supplier/seller_web_dashboard';

// Admin Panel Screens
import AdminWebPanel from './admin_panel/admin_web_panel';
import AdminProductCatalog from './admin_panel/admin_product_catalog';
import CampaignCreationFlowAdmin from './admin_panel/campaign_creation_flow_admin';
import PerformanceAnalyticsDashboardAdmin from './admin_panel/performance_analytics_dashboard_admin';

// Community, Chat & Support Screens
import CommunityHub from './Community_Social_Chat_&_Customer_Support/community_hub';
import MeeshoMessengerChatHub from './Community_Social_Chat_&_Customer_Support/meesho_messenger_chat_hub';
import ConversationScreen from './Community_Social_Chat_&_Customer_Support/conversation_screen';
import SupportCenter from './Community_Social_Chat_&_Customer_Support/support_center';
import RaiseATicket from './Community_Social_Chat_&_Customer_Support/raise_a_ticket';
import NotificationCenter from './Community_Social_Chat_&_Customer_Support/notification_center';

// Design Ecosystem & Theme Variations
import TheDigitalCuratorEcosystem from './Design_Ecosystem_&_Theme_Variations/the_digital_curator_ecosystem';
import PetalCollective from './Design_Ecosystem_&_Theme_Variations/petal_collective';
import GildedPulse from './Design_Ecosystem_&_Theme_Variations/gilded_pulse';
import SocialCommerceLuxe from './Design_Ecosystem_&_Theme_Variations/social_commerce_luxe';
import SignalCore from './Design_Ecosystem_&_Theme_Variations/signal_core';
import StructureFlow from './Design_Ecosystem_&_Theme_Variations/structure_flow';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('reseller');
  const [screenHistory, setScreenHistory] = useState(['reseller']);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const navigateTo = (screenId) => {
    setScreenHistory((prev) => [...prev, screenId]);
    setActiveScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length > 1) {
        const nextHist = [...prev];
        nextHist.pop();
        const prevScreen = nextHist[nextHist.length - 1];
        setActiveScreen(prevScreen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return nextHist;
      }
      setActiveScreen('reseller');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return ['reseller'];
    });
  };

  const screens = [
    // Customer & Shopping
    { id: 'reseller', name: 'Reseller Home', icon: '🛍️', group: 'Shopping' },
    { id: 'user_dashboard', name: 'Curator Web Dashboard', icon: '📊', group: 'Shopping' },
    { id: 'luxe', name: 'Flutter Luxe', icon: '✨', group: 'Shopping' },
    { id: 'explorer', name: 'Categories Explorer', icon: '🗂️', group: 'Shopping' },
    { id: 'search', name: 'Search Results', icon: '🔍', group: 'Shopping' },
    { id: 'sarees', name: 'Sarees Listing', icon: '🥻', group: 'Shopping' },
    { id: 'western', name: 'Women Western', icon: '👗', group: 'Shopping' },
    { id: 'spotlight', name: 'Curated Spotlight', icon: '🌟', group: 'Shopping' },
    { id: 'flash', name: 'Flash Sale Drop', icon: '⚡', group: 'Shopping' },
    { id: 'product', name: 'Product Detail', icon: '🏷️', group: 'Shopping' },
    { id: 'reviews', name: 'Ratings & Reviews', icon: '⭐', group: 'Shopping' },
    { id: 'write_review', name: 'Write a Review', icon: '✍️', group: 'Shopping' },
    { id: 'wishlist', name: 'User Wishlist', icon: '❤️', group: 'Shopping' },
    { id: 'cart', name: 'Shopping Cart', icon: '🛒', group: 'Shopping' },
    { id: 'address', name: 'Checkout Address', icon: '📍', group: 'Shopping' },
    { id: 'payment', name: 'Checkout Payment', icon: '💳', group: 'Shopping' },

    // Logistics & Driver
    { id: 'driver_dashboard', name: 'Driver Dashboard', icon: '🛵', group: 'Logistics' },
    { id: 'available_tasks', name: 'Available Tasks', icon: '📦', group: 'Logistics' },
    { id: 'order_driver', name: 'Order Details Driver', icon: '📋', group: 'Logistics' },
    { id: 'active_delivery', name: 'Active Delivery Map', icon: '🗺️', group: 'Logistics' },
    { id: 'delivery_history', name: 'Delivery History', icon: '📜', group: 'Logistics' },
    { id: 'driver_earnings', name: 'Driver Earnings', icon: '💰', group: 'Logistics' },
    { id: 'rider_express', name: 'Rider Express', icon: '⚡', group: 'Logistics' },

    // Supplier Hub
    { id: 'structureFlow', name: 'Structure Flow (Hub)', icon: '🏬', group: 'Supplier' },
    { id: 'dashboard2', name: 'Supplier Dashboard 2', icon: '📈', group: 'Supplier' },
    { id: 'dashboard1', name: 'Supplier Dashboard 1', icon: '📉', group: 'Supplier' },
    { id: 'inventory', name: 'Inventory Management', icon: '📦', group: 'Supplier' },
    { id: 'orders', name: 'Supplier Orders List', icon: '📑', group: 'Supplier' },
    { id: 'addProduct', name: 'Add New Product', icon: '➕', group: 'Supplier' },
    { id: 'addCategory', name: 'Add Category', icon: '🏷️', group: 'Supplier' },
    { id: 'profile', name: 'Supplier Profile', icon: '👤', group: 'Supplier' },
    { id: 'webDashboard', name: 'Seller Web Dashboard', icon: '💻', group: 'Supplier' },

    // Admin Panel
    { id: 'adminPanel', name: 'Admin Web Panel', icon: '🛡️', group: 'Admin' },
    { id: 'adminCatalog', name: 'Admin Catalog', icon: '📁', group: 'Admin' },
    { id: 'campaignFlow', name: 'Campaign Creation', icon: '📢', group: 'Admin' },
    { id: 'adminAnalytics', name: 'Performance Analytics', icon: '📊', group: 'Admin' },

    // Community & Support
    { id: 'communityHub', name: 'Community Hub', icon: '👥', group: 'Community' },
    { id: 'messenger', name: 'Messenger Chat Hub', icon: '💬', group: 'Community' },
    { id: 'chatScreen', name: 'Conversation Screen', icon: '🗨️', group: 'Community' },
    { id: 'supportCenter', name: 'Support Center', icon: '🎧', group: 'Community' },
    { id: 'raiseTicket', name: 'Raise A Ticket', icon: '🎫', group: 'Community' },
    { id: 'notifications', name: 'Notification Center', icon: '🔔', group: 'Community' },

    // Design Themes & Ecosystem
    { id: 'digitalCurator', name: 'Digital Curator', icon: '🎨', group: 'Themes' },
    { id: 'petalCollective', name: 'Petal Collective', icon: '🌸', group: 'Themes' },
    { id: 'gildedPulse', name: 'Gilded Pulse', icon: '👑', group: 'Themes' },
    { id: 'socialCommerceLuxe', name: 'Social Commerce Luxe', icon: '💎', group: 'Themes' },
    { id: 'signalCore', name: 'Signal Core', icon: '⚡', group: 'Themes' },
  ];

  const groups = ['All', 'Shopping', 'Logistics', 'Supplier', 'Admin', 'Community', 'Themes'];

  const filteredScreens = screens.filter((s) => {
    if (selectedGroup === 'All') return true;
    return s.group === selectedGroup;
  });

  return (
    <div className="relative min-h-screen bg-[#f8f9fb]">
      {/* Floating Screen Switcher Drawer */}
      <div className="fixed bottom-5 right-5 z-[999999] flex flex-col items-end gap-2">
        {isSwitcherOpen && (
          <div className="bg-gray-950/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl border-2 border-pink-500 max-w-[95vw] sm:max-w-lg w-full animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  Meesho Full Navigator ({screens.length} Screens)
                </span>
              </div>
              <button
                onClick={() => setIsSwitcherOpen(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded-lg hover:bg-gray-800 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {groups.map((group) => {
                const count = group === 'All' ? screens.length : screens.filter((s) => s.group === group).length;
                return (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedGroup === group
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
                const isActive = activeScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      navigateTo(screen.id);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                      isActive
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
        )}

        {/* Toggle / Minimize Button */}
        <button
          onClick={() => setIsSwitcherOpen((prev) => !prev)}
          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2.5 rounded-full font-black text-xs shadow-xl shadow-pink-500/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-white/20"
        >
          <span>📱</span>
          <span>{isSwitcherOpen ? 'Hide Navigator' : `Switch Screens (${screens.length})`}</span>
        </button>
      </div>

      {/* Screen Render Canvas */}
      {/* 1. Customer & Reseller Flow */}
      {activeScreen === 'reseller' && <HomeUserReseller onNavigate={navigateTo} />}
      {activeScreen === 'user_dashboard' && <UserWebDashboard onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'luxe' && <HomeScreenFlutterLuxe onNavigate={navigateTo} />}
      {activeScreen === 'explorer' && <SearchCategoriesExplorer onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'search' && <SearchResults onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'sarees' && <SareesCategoryListing onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'western' && <WomenWesternCategory onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'spotlight' && <CuratedSpotlight onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'flash' && <FlashSaleLandingPage onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'product' && <ProductDetail onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'reviews' && <RatingsReviews onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'write_review' && <WriteAReview onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'wishlist' && <UserWishlist onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'cart' && <ShoppingCart onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'address' && <CheckoutAddressSelection onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'payment' && <CheckoutPayment onNavigate={navigateTo} onBack={goBack} />}

      {/* 2. Delivery & Driver Logistics */}
      {activeScreen === 'driver_dashboard' && <DriverDashboardMobile onNavigate={navigateTo} />}
      {activeScreen === 'available_tasks' && <AvailableTasks onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'order_driver' && <OrderDetailsDriver onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'active_delivery' && <ActiveDeliveryMobile onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'delivery_history' && <DeliveryHistoryMobile onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'driver_earnings' && <DriverEarningsMobile onNavigate={navigateTo} onBack={goBack} />}
      {activeScreen === 'rider_express' && <RiderExpressDashboard onNavigate={navigateTo} onBack={goBack} />}

      {/* 3. Supplier Hub */}
      {activeScreen === 'structureFlow' && (
        <StructureFlow
          onNavigate={(tab) => {
            if (tab === 'dashboard') navigateTo('structureFlow');
            if (tab === 'inventory') navigateTo('inventory');
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'profile') navigateTo('profile');
          }}
          onAddNewProduct={() => navigateTo('addProduct')}
          onViewInventory={() => navigateTo('inventory')}
          onViewOrders={() => navigateTo('orders')}
        />
      )}
      {activeScreen === 'dashboard2' && (
        <SupplierDashboard2
          onAddNewProduct={() => navigateTo('addProduct')}
          onViewInventory={() => navigateTo('inventory')}
          onViewAllOrders={() => navigateTo('orders')}
          onNavChange={(tabId) => {
            if (tabId === 'inventory') navigateTo('inventory');
            if (tabId === 'orders') navigateTo('orders');
            if (tabId === 'profile') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'dashboard1' && (
        <SupplierDashboard1
          onNavigate={(tab) => {
            if (tab === 'Inventory') navigateTo('inventory');
            if (tab === 'Orders') navigateTo('orders');
            if (tab === 'Profile') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'inventory' && (
        <SupplierInventoryManagement
          onNavigate={(tab) => {
            if (tab === 'Home') navigateTo('dashboard2');
            if (tab === 'Orders') navigateTo('orders');
            if (tab === 'Profile') navigateTo('profile');
          }}
          onAddProduct={() => navigateTo('addProduct')}
        />
      )}
      {activeScreen === 'orders' && (
        <SupplierOrdersList
          onBack={() => navigateTo('dashboard2')}
          onNavigate={(id) => {
            if (id === 'dashboard') navigateTo('dashboard2');
            if (id === 'inventory') navigateTo('inventory');
            if (id === 'account') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'addProduct' && (
        <AddNewProductSupplier
          onBack={() => navigateTo('dashboard2')}
          onPublish={() => navigateTo('inventory')}
          onSaveDraft={() => navigateTo('inventory')}
        />
      )}
      {activeScreen === 'addCategory' && (
        <AddCategorySupplier
          onBack={() => navigateTo('dashboard2')}
          onSaveCategory={() => navigateTo('inventory')}
        />
      )}
      {activeScreen === 'profile' && (
        <SupplierProfile
          onBack={() => navigateTo('dashboard2')}
          onNavigate={(id) => {
            if (id === 'dashboard') navigateTo('dashboard2');
            if (id === 'orders') navigateTo('orders');
            if (id === 'inventory') navigateTo('inventory');
          }}
          onLogout={() => navigateTo('dashboard2')}
        />
      )}
      {activeScreen === 'webDashboard' && (
        <SellerWebDashboard
          onNavigate={(tab) => {
            if (tab === 'inventory') navigateTo('inventory');
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'profile') navigateTo('profile');
          }}
          onViewProducts={() => navigateTo('inventory')}
          onViewOrders={() => navigateTo('orders')}
        />
      )}

      {/* 4. Admin Panel */}
      {activeScreen === 'adminPanel' && (
        <AdminWebPanel
          onNavigate={(id) => {
            if (id === 'products') navigateTo('adminCatalog');
            if (id === 'orders') navigateTo('orders');
            if (id === 'sellers') navigateTo('profile');
          }}
          onSwitchView={() => navigateTo('webDashboard')}
        />
      )}
      {activeScreen === 'adminCatalog' && (
        <AdminProductCatalog
          onNavigate={(id) => {
            if (id === 'dashboard') navigateTo('adminPanel');
            if (id === 'orders') navigateTo('orders');
            if (id === 'suppliers') navigateTo('profile');
          }}
          onAddNewProduct={() => navigateTo('addProduct')}
        />
      )}
      {activeScreen === 'campaignFlow' && (
        <CampaignCreationFlowAdmin
          onNavigate={(id) => {
            if (id === 'dashboard') navigateTo('adminPanel');
            if (id === 'catalog') navigateTo('adminCatalog');
            if (id === 'orders') navigateTo('orders');
          }}
          onCancel={() => navigateTo('adminPanel')}
        />
      )}
      {activeScreen === 'adminAnalytics' && (
        <PerformanceAnalyticsDashboardAdmin
          onNavigate={(id) => {
            if (id === 'dashboard') navigateTo('adminPanel');
            if (id === 'orders') navigateTo('orders');
            if (id === 'catalog') navigateTo('adminCatalog');
            if (id === 'resellers') navigateTo('profile');
            if (id === 'campaigns') navigateTo('campaignFlow');
          }}
        />
      )}

      {/* 5. Community & Support */}
      {activeScreen === 'communityHub' && (
        <CommunityHub
          onNavigate={(tab) => {
            if (tab === 'home') navigateTo('dashboard2');
            if (tab === 'shop') navigateTo('inventory');
            if (tab === 'earnings') navigateTo('adminAnalytics');
            if (tab === 'profile') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'messenger' && (
        <MeeshoMessengerChatHub
          onNavigate={(tab) => {
            if (tab === 'community') navigateTo('communityHub');
          }}
        />
      )}
      {activeScreen === 'chatScreen' && (
        <ConversationScreen
          onBack={() => navigateTo('messenger')}
          onNavigate={(tab) => {
            if (tab === 'messenger') navigateTo('messenger');
            if (tab === 'community') navigateTo('communityHub');
          }}
        />
      )}
      {activeScreen === 'supportCenter' && (
        <SupportCenter
          onNavigate={(tab) => {
            if (tab === 'home') navigateTo('webDashboard');
            if (tab === 'shop') navigateTo('inventory');
            if (tab === 'earnings') navigateTo('adminAnalytics');
            if (tab === 'orders') navigateTo('orders');
          }}
          onOpenChat={() => navigateTo('chatScreen')}
        />
      )}
      {activeScreen === 'raiseTicket' && (
        <RaiseATicket
          onBack={() => navigateTo('supportCenter')}
          onNavigate={(tab) => {
            if (tab === 'support') navigateTo('supportCenter');
            if (tab === 'home') navigateTo('webDashboard');
            if (tab === 'shop') navigateTo('inventory');
            if (tab === 'earnings') navigateTo('adminAnalytics');
            if (tab === 'orders') navigateTo('orders');
          }}
        />
      )}
      {activeScreen === 'notifications' && (
        <NotificationCenter
          onBack={() => navigateTo('supportCenter')}
          onNavigate={(tab) => {
            if (tab === 'home') navigateTo('webDashboard');
            if (tab === 'explore') navigateTo('communityHub');
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'earnings') navigateTo('adminAnalytics');
          }}
        />
      )}

      {/* 6. Themes & Design Ecosystem */}
      {activeScreen === 'digitalCurator' && (
        <TheDigitalCuratorEcosystem
          onNavigate={(tab) => {
            if (tab === 'home') navigateTo('digitalCurator');
            if (tab === 'categories') navigateTo('adminCatalog');
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'earnings') navigateTo('adminAnalytics');
            if (tab === 'profile') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'petalCollective' && (
        <PetalCollective
          onNavigate={(view) => {
            if (view === 'digitalCurator') navigateTo('digitalCurator');
            if (view === 'home') navigateTo('digitalCurator');
          }}
          onLoginSuccess={() => navigateTo('digitalCurator')}
        />
      )}
      {activeScreen === 'gildedPulse' && (
        <GildedPulse
          onNavigate={(tab) => {
            if (tab === 'insight') navigateTo('gildedPulse');
            if (tab === 'assets') navigateTo('adminAnalytics');
            if (tab === 'network') navigateTo('profile');
            if (tab === 'rewards') navigateTo('digitalCurator');
          }}
        />
      )}
      {activeScreen === 'socialCommerceLuxe' && (
        <SocialCommerceLuxe
          onNavigate={(tab) => {
            if (tab === 'home') navigateTo('socialCommerceLuxe');
            if (tab === 'categories') navigateTo('adminCatalog');
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'community') navigateTo('communityHub');
            if (tab === 'account') navigateTo('profile');
          }}
        />
      )}
      {activeScreen === 'signalCore' && (
        <SignalCore
          onNavigate={(tab) => {
            if (tab === 'orders') navigateTo('orders');
            if (tab === 'earnings') navigateTo('adminAnalytics');
            if (tab === 'profile') navigateTo('profile');
          }}
        />
      )}
    </div>
  );
}
