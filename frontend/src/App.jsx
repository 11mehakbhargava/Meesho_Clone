import { useState } from 'react';
import SupplierDashboard2 from './supplier/supplier_dashboard2';
import SupplierDashboard1 from './supplier/supplier_dashboard1';
import SupplierInventoryManagement from './supplier/supplier_inventory_management';
import SupplierOrdersList from './supplier/supplier_orders_list';
import SupplierProfile from './supplier/supplier_profile';
import AddNewProductSupplier from './supplier/add_new_product_supplier';
import AddCategorySupplier from './supplier/add_category_supplier';
import SellerWebDashboard from './supplier/seller_web_dashboard';
import AdminWebPanel from './admin_panel/admin_web_panel';
import AdminProductCatalog from './admin_panel/admin_product_catalog';
import CampaignCreationFlowAdmin from './admin_panel/campaign_creation_flow_admin';
import PerformanceAnalyticsDashboardAdmin from './admin_panel/performance_analytics_dashboard_admin';
import CommunityHub from './Community_Social_Chat_&_Customer_Support/community_hub';
import MeeshoMessengerChatHub from './Community_Social_Chat_&_Customer_Support/meesho_messenger_chat_hub';
import ConversationScreen from './Community_Social_Chat_&_Customer_Support/conversation_screen';
import SupportCenter from './Community_Social_Chat_&_Customer_Support/support_center';
import RaiseATicket from './Community_Social_Chat_&_Customer_Support/raise_a_ticket';
import NotificationCenter from './Community_Social_Chat_&_Customer_Support/notification_center';
import TheDigitalCuratorEcosystem from './Design_Ecosystem_&_Theme_Variations/the_digital_curator_ecosystem';
import PetalCollective from './Design_Ecosystem_&_Theme_Variations/petal_collective';
import GildedPulse from './Design_Ecosystem_&_Theme_Variations/gilded_pulse';
import SocialCommerceLuxe from './Design_Ecosystem_&_Theme_Variations/social_commerce_luxe';
import SignalCore from './Design_Ecosystem_&_Theme_Variations/signal_core';
import StructureFlow from './Design_Ecosystem_&_Theme_Variations/structure_flow';

export default function App() {
  const [currentView, setCurrentView] = useState('structureFlow');

  return (
    <div className="min-h-screen">
      {/* Quick Switcher for previewing all supplier & admin pages */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-between z-[9999] sticky top-0 shadow-md">
        <span className="font-semibold text-slate-300">Views Switcher:</span>
        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentView('structureFlow')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'structureFlow'
              ? 'bg-[#005ea5] text-white font-bold ring-2 ring-white/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Structure Flow (New)
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('signalCore')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'signalCore'
              ? 'bg-[#fe8534] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Signal Core
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('socialCommerceLuxe')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'socialCommerceLuxe'
              ? 'bg-pink-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Social Commerce Luxe
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('gildedPulse')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'gildedPulse'
              ? 'bg-[#f6b630] text-[#513800] font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Gilded Pulse
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('petalCollective')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'petalCollective'
              ? 'bg-[#b7004d] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Petal Collective
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('digitalCurator')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'digitalCurator'
              ? 'bg-[#FF3F6C] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Digital Curator
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('notifications')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'notifications'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Notifications
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('raiseTicket')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'raiseTicket'
              ? 'bg-rose-700 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Raise Ticket
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('supportCenter')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'supportCenter'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Support Center
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('chatScreen')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'chatScreen'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Chat Screen
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('messenger')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'messenger'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Messenger
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('communityHub')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'communityHub'
              ? 'bg-rose-500 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Community Hub
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('adminAnalytics')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'adminAnalytics'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Admin Analytics
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('campaignFlow')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'campaignFlow'
              ? 'bg-[#b90041] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Campaign Flow
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('adminCatalog')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'adminCatalog'
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Admin Catalog
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('adminPanel')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'adminPanel'
              ? 'bg-red-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Admin Panel
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('webDashboard')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'webDashboard'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Web Dashboard
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('addCategory')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'addCategory'
              ? 'bg-amber-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('addProduct')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'addProduct'
              ? 'bg-[#B90041] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'profile'
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('orders')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'orders'
              ? 'bg-[#FF3F6C] text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('inventory')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'inventory'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Inventory
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard2')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'dashboard2'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Dashboard 2
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard1')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors whitespace-nowrap ${currentView === 'dashboard1'
              ? 'bg-pink-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            Dashboard 1
          </button>
        </div>
      </div>

      {currentView === 'structureFlow' ? (
        <StructureFlow
          onNavigate={(tab) => {
            if (tab === 'dashboard') setCurrentView('structureFlow');
            if (tab === 'inventory') setCurrentView('inventory');
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'profile') setCurrentView('profile');
          }}
          onAddNewProduct={() => setCurrentView('addProduct')}
          onViewInventory={() => setCurrentView('inventory')}
          onViewOrders={() => setCurrentView('orders')}
        />
      ) : currentView === 'signalCore' ? (
        <SignalCore
          onNavigate={(tab) => {
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
            if (tab === 'profile') setCurrentView('profile');
          }}
        />
      ) : currentView === 'socialCommerceLuxe' ? (
        <SocialCommerceLuxe
          onNavigate={(tab) => {
            if (tab === 'home') setCurrentView('socialCommerceLuxe');
            if (tab === 'categories') setCurrentView('adminCatalog');
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'community') setCurrentView('communityHub');
            if (tab === 'account') setCurrentView('profile');
          }}
        />
      ) : currentView === 'gildedPulse' ? (
        <GildedPulse
          onNavigate={(tab) => {
            if (tab === 'insight') setCurrentView('gildedPulse');
            if (tab === 'assets') setCurrentView('adminAnalytics');
            if (tab === 'network') setCurrentView('profile');
            if (tab === 'rewards') setCurrentView('digitalCurator');
          }}
        />
      ) : currentView === 'petalCollective' ? (
        <PetalCollective
          onNavigate={(view) => {
            if (view === 'digitalCurator') setCurrentView('digitalCurator');
            if (view === 'home') setCurrentView('digitalCurator');
          }}
          onLoginSuccess={() => setCurrentView('digitalCurator')}
        />
      ) : currentView === 'digitalCurator' ? (
        <TheDigitalCuratorEcosystem
          onNavigate={(tab) => {
            if (tab === 'home') setCurrentView('digitalCurator');
            if (tab === 'categories') setCurrentView('adminCatalog');
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
            if (tab === 'profile') setCurrentView('profile');
          }}
        />
      ) : currentView === 'notifications' ? (
        <NotificationCenter
          onBack={() => setCurrentView('supportCenter')}
          onNavigate={(tab) => {
            if (tab === 'home') setCurrentView('webDashboard');
            if (tab === 'explore') setCurrentView('communityHub');
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
          }}
        />
      ) : currentView === 'raiseTicket' ? (
        <RaiseATicket
          onBack={() => setCurrentView('supportCenter')}
          onNavigate={(tab) => {
            if (tab === 'support') setCurrentView('supportCenter');
            if (tab === 'home') setCurrentView('webDashboard');
            if (tab === 'shop') setCurrentView('inventory');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
            if (tab === 'orders') setCurrentView('orders');
          }}
        />
      ) : currentView === 'supportCenter' ? (
        <SupportCenter
          onNavigate={(tab) => {
            if (tab === 'home') setCurrentView('webDashboard');
            if (tab === 'shop') setCurrentView('inventory');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
            if (tab === 'orders') setCurrentView('orders');
          }}
          onOpenChat={() => setCurrentView('chatScreen')}
        />
      ) : currentView === 'chatScreen' ? (
        <ConversationScreen
          onBack={() => setCurrentView('messenger')}
          onNavigate={(tab) => {
            if (tab === 'messenger') setCurrentView('messenger');
            if (tab === 'community') setCurrentView('communityHub');
          }}
        />
      ) : currentView === 'messenger' ? (
        <MeeshoMessengerChatHub
          onNavigate={(tab) => {
            if (tab === 'community') setCurrentView('communityHub');
          }}
        />
      ) : currentView === 'communityHub' ? (
        <CommunityHub
          onNavigate={(tab) => {
            if (tab === 'home') setCurrentView('dashboard2');
            if (tab === 'shop') setCurrentView('inventory');
            if (tab === 'earnings') setCurrentView('adminAnalytics');
            if (tab === 'profile') setCurrentView('profile');
          }}
        />
      ) : currentView === 'adminAnalytics' ? (
        <PerformanceAnalyticsDashboardAdmin
          onNavigate={(id) => {
            if (id === 'dashboard') setCurrentView('adminPanel');
            if (id === 'orders') setCurrentView('orders');
            if (id === 'catalog') setCurrentView('adminCatalog');
            if (id === 'resellers') setCurrentView('profile');
            if (id === 'campaigns') setCurrentView('campaignFlow');
          }}
        />
      ) : currentView === 'campaignFlow' ? (
        <CampaignCreationFlowAdmin
          onNavigate={(id) => {
            if (id === 'dashboard') setCurrentView('adminPanel');
            if (id === 'catalog') setCurrentView('adminCatalog');
            if (id === 'orders') setCurrentView('orders');
          }}
          onCancel={() => setCurrentView('adminPanel')}
        />
      ) : currentView === 'adminCatalog' ? (
        <AdminProductCatalog
          onNavigate={(id) => {
            if (id === 'dashboard') setCurrentView('adminPanel');
            if (id === 'orders') setCurrentView('orders');
            if (id === 'suppliers') setCurrentView('profile');
          }}
          onAddNewProduct={() => setCurrentView('addProduct')}
        />
      ) : currentView === 'adminPanel' ? (
        <AdminWebPanel
          onNavigate={(id) => {
            if (id === 'products') setCurrentView('adminCatalog');
            if (id === 'orders') setCurrentView('orders');
            if (id === 'sellers') setCurrentView('profile');
          }}
          onSwitchView={() => setCurrentView('webDashboard')}
        />
      ) : currentView === 'webDashboard' ? (
        <SellerWebDashboard
          onNavigate={(tab) => {
            if (tab === 'inventory') setCurrentView('inventory');
            if (tab === 'orders') setCurrentView('orders');
            if (tab === 'profile') setCurrentView('profile');
          }}
          onViewProducts={() => setCurrentView('inventory')}
          onViewOrders={() => setCurrentView('orders')}
        />
      ) : currentView === 'addCategory' ? (
        <AddCategorySupplier
          onBack={() => setCurrentView('dashboard2')}
          onSaveCategory={() => setCurrentView('inventory')}
        />
      ) : currentView === 'addProduct' ? (
        <AddNewProductSupplier
          onBack={() => setCurrentView('dashboard2')}
          onPublish={() => setCurrentView('inventory')}
          onSaveDraft={() => setCurrentView('inventory')}
        />
      ) : currentView === 'profile' ? (
        <SupplierProfile
          onBack={() => setCurrentView('dashboard2')}
          onNavigate={(id) => {
            if (id === 'dashboard') setCurrentView('dashboard2');
            if (id === 'orders') setCurrentView('orders');
            if (id === 'inventory') setCurrentView('inventory');
          }}
          onLogout={() => setCurrentView('dashboard2')}
        />
      ) : currentView === 'orders' ? (
        <SupplierOrdersList
          onBack={() => setCurrentView('dashboard2')}
          onNavigate={(id) => {
            if (id === 'dashboard') setCurrentView('dashboard2');
            if (id === 'inventory') setCurrentView('inventory');
            if (id === 'account') setCurrentView('profile');
          }}
        />
      ) : currentView === 'inventory' ? (
        <SupplierInventoryManagement
          onNavigate={(tab) => {
            if (tab === 'Home') setCurrentView('dashboard2');
            if (tab === 'Orders') setCurrentView('orders');
            if (tab === 'Profile') setCurrentView('profile');
          }}
          onAddProduct={() => setCurrentView('addProduct')}
        />
      ) : currentView === 'dashboard2' ? (
        <SupplierDashboard2
          onAddNewProduct={() => setCurrentView('addProduct')}
          onViewInventory={() => setCurrentView('inventory')}
          onViewAllOrders={() => setCurrentView('orders')}
          onNavChange={(tabId) => {
            if (tabId === 'inventory') setCurrentView('inventory');
            if (tabId === 'orders') setCurrentView('orders');
            if (tabId === 'profile') setCurrentView('profile');
          }}
        />
      ) : (
        <SupplierDashboard1
          onNavigate={(tab) => {
            if (tab === 'Inventory') setCurrentView('inventory');
            if (tab === 'Orders') setCurrentView('orders');
            if (tab === 'Profile') setCurrentView('profile');
          }}
        />
      )}
    </div>
  );
}
