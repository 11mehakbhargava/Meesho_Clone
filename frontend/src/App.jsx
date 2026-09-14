import { BrowserRouter, Routes, Route } from "react-router-dom";

// Reseller Pages
import HomeUserReseller from "./pages/HomeUserReseller";
import ShareEarnConfig from "./pages/ShareEarnConfig";
import AffiliateProgram from "./pages/AffiliateProgram";
import AffiliateProgramPanel from "./pages/AffiliateProgramPanel";
import MyWalletFintechStyle from "./pages/MyWalletFintechStyle";
import CommunityHub from "./pages/CommunityHub";
import PayoutSettings from "./pages/PayoutSettings";
import PayoutConfirmation from "./pages/PayoutConfirmation";
import NotificationCenter from "./pages/NotificationCenter";
import ConversationScreen from "./pages/ConversationScreen";
import MeeshoMessengerChatHub from "./pages/MeeshoMessengerChatHub";

// Previously Converted Pages
import LoginSignup from "./pages/LoginSignup";
import ReferEarn from "./pages/ReferEarn";
import ResellEarn from "./pages/ResellEarn";
import EarningsDashboard1 from "./pages/EarningsDashboard1";
import EarningsDashboard2 from "./pages/EarningsDashboard2";
import ResellerWallet from "./pages/ResellerWallet";
import WithdrawEarnings from "./pages/WithdrawEarnings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Reseller Catalog / Home */}
        <Route path="/" element={<HomeUserReseller />} />
        <Route path="/reseller-home" element={<HomeUserReseller />} />

        {/* Resell Margin & Sharing */}
        <Route path="/share-earn-config" element={<ShareEarnConfig />} />
        <Route path="/resell-earn" element={<ResellEarn />} />

        {/* Earnings & Analytics */}
        <Route path="/earnings-dashboard-1" element={<EarningsDashboard1 />} />
        <Route path="/earnings-dashboard-2" element={<EarningsDashboard2 />} />
        <Route path="/refer-earn" element={<ReferEarn />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        <Route path="/affiliate-panel" element={<AffiliateProgramPanel />} />

        {/* Wallet & Payouts */}
        <Route path="/my-wallet" element={<MyWalletFintechStyle />} />
        <Route path="/reseller-wallet" element={<ResellerWallet />} />
        <Route path="/withdraw-earnings" element={<WithdrawEarnings />} />
        <Route path="/payout-settings" element={<PayoutSettings />} />
        <Route path="/payout-confirmation" element={<PayoutConfirmation />} />

        {/* Communication, Community & Alerts */}
        <Route path="/community-hub" element={<CommunityHub />} />
        <Route path="/messenger" element={<MeeshoMessengerChatHub />} />
        <Route path="/conversation" element={<ConversationScreen />} />
        <Route path="/notifications" element={<NotificationCenter />} />

        {/* Auth */}
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;