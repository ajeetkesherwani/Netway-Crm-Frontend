import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";
import StaffList from "./pages/Staff/StaffList";
import RetailerList from "./pages/Retailer/RetailerList";
import RetailerView from "./pages/Retailer/RetailerDetails";
import RetailerUpdate from "./pages/Retailer/RetailerUpdate";
import RetailerCreate from "./pages/Retailer/RetailerCreate";
import LcoList from "./pages/LcoPage/LcoList";
import LcoDetails from "./pages/LcoPage/LcoDetails";
import PackageList from "./pages/Package/PackageList";
import CreateLco from "./pages/LcoPage/LcoCreate";
import PackageDetails from "./pages/Package/PackageDetails";
import PackageCreate from "./pages/Package/PackageCreate";
import CustomerList from "./pages/Customer/CustomerList";
import UserDetails from "./pages/Customer/CustomerDetails";
import CreateUser from "./pages/Customer/CustomerCreate";
import SignInReseller from "./pages/AuthPages/SignInReseller";
import RoleList from "./pages/RolePerrmission/RoleList";
import CreateRole from "./pages/RolePerrmission/CreateRole";
import ViewRoleDetail from "./pages/RolePerrmission/ViewRoleDetail";
import UpdateRole from "./pages/RolePerrmission/UpdateRole";
import AssignPackage from "./pages/Retailer/AssignPackage/AssignPackage";
import AssignPackageList from "./pages/Retailer/AssignPackage/AssignPackageList";
import ViewAssignedPackage from "./pages/Retailer/AssignPackage/ViewAssignedPackage";
// import TicketList from "./pages/Ticket/RenewalTicket";
// import TicketCreate from "./pages/Ticket/TIcketCreate";
import SignInStaff from "./pages/AuthPages/StaffSignIn";
import SignInLco from "./pages/AuthPages/LcoSignIn";
import RetailerWalletList from "./pages/Retailer/RetailerWallet/RetailerWalletList";
import RetailerWalletView from "./pages/Retailer/RetailerWallet/RetailerWalletView";
import LcoWalletList from "./pages/LcoPage/LcoWallet/LcoWalletList";
import LcoWalletView from "./pages/LcoPage/LcoWallet/LcoWalletView";
import PriceBookList from "./pages/PriceBook/PriceBookList";
import LcoWalletCreate from "./pages/LcoPage/LcoWallet/LcoWalletCreate";
import LcoWalletUpdate from "./pages/LcoPage/LcoWallet/LcoWalletUpdate";
import RetailerWalletCreate from "./pages/Retailer/RetailerWallet/RetailerWalletCreate";
import PriceBookCreate from "./pages/PriceBook/PriceBookCreate";
import PriceBookView from "./pages/PriceBook/PriceBookView";
import StaffCreate from "./pages/Staff/StaffCreate";
import StaffView from "./pages/Staff/StaffView";
import StaffUpdate from "./pages/Staff/StaffEdit";
// import TicketView from "./pages/Ticket/TicketView";
import CloseTicket from "./pages/Ticket/CloseTicket";
import ManageTicket from "./pages/Ticket/ManageTicket";
import AllTicket from "./pages/Ticket/AllTicket";
import ApprovelTicket from "./pages/Ticket/ApprovelTicket";
import Jon from "./pages/Setting/Jon";
import TicketCattogry from "./pages/Setting/TicketCattogry";
import ZoneList from "./pages/Setting/ZoneList";
import RetailerEmployeeList from "./pages/Retailer/RetailorEmployee/RetailorEmployeeList";
import RetailerEmployeeCreate from "./pages/Retailer/RetailorEmployee/RetailerEmployeeCreate";
import ResellerEmployeeUpdate from "./pages/Retailer/RetailorEmployee/RetailerEmployeeUpdate";
import LcoEmployeeList from "./pages/LcoPage/LcoEmployee/LcoEmployeeList";
import LcoEmployeeCreate from "./pages/LcoPage/LcoEmployee/LcoEmployeeCreate";
import LcoEmployeeUpdate from "./pages/LcoPage/LcoEmployee/LcoEmployeeUpdate";
import LcoUpdate from "./pages/LcoPage/LcoUpdate";
import LcoAssignPackageList from "./pages/LcoPage/AssignPackage/LcoAssignPackageList";
import RoleConfigList from "./pages/RoleConfig/RoleConfigList";
import CustomerUpdate from "./pages/Customer/CustomerUpdate";
import RoleConfigCreate from "./pages/RoleConfig/RoleConfigCreate";
import ReportList from "./pages/ReportPages/ReportList";
import AccountWiseProfileReport from "./pages/ReportPages/SubscriberReport/AccountWiseProfileReport";
import InactiveCustomerReport from "./pages/ReportPages/SubscriberReport/InactiveCustomerReport";
import SuspendedCustomerReport from "./pages/ReportPages/SubscriberReport/SuspendedCustomerReport";
import LcoBalanceTransferHistory from "./pages/ReportPages/FranchiseeReport/LcoBalanceTransferHistory";
import LcoTransactionHistory from "./pages/ReportPages/FranchiseeReport/LcoTransactionHistory";
import OnlineTransaction from "./pages/ReportPages/FranchiseeReport/OnlineTransactin";
import ResellerTransferBalance from "./pages/ReportPages/FranchiseeReport/ResellerTransferBalance";
import RoleConfigDetail from "./pages/RoleConfig/RoleConfigDetail";
import RoleConfigUpdate from "./pages/RoleConfig/RoleConfigUpdate";
import CustomerBalanceReport from "./pages/ReportPages/MISReports/CustomerBalanceReport";
import CustomerUpdateHistory from "./pages/ReportPages/MISReports/CustomerUpdateHistory";
import UpcomingRenewalByDays from "./pages/ReportPages/MISReports/UpcomingRenewalByDays";
import UpcomingRenewalByMonth from "./pages/ReportPages/MISReports/UpcomingRenewalByMonth";
import ZoneCreate from "./pages/Setting/ZoneCreate";
import ZoneUpdate from "./pages/Setting/ZoneUpdate";
import PriceBookUpdate from "./pages/PriceBook/PriceBookUpdate";
import Home from "./pages/Dashboard/Home";
import ViewDetails from "./pages/Dashboard/components/ViewDetails";
import HardwareList from "./pages/Setting/HardwareList";
import HardwareCreate from "./pages/Setting/HardwareCreate";
import HardwareView from "./pages/Setting/HardwareView";
import HardwareUpdate from "./pages/Setting/HardwareUpdate";
import RecentPurchasedOrRenewReport from "./pages/ReportPages/RevenueReport/RecentPurchasedOrRenewReport";
import PaymentReport from "./pages/ReportPages/RevenueReport/PaymentReport";
import NewRegistrationPlanReport from "./pages/ReportPages/RevenueReport/NewRegistrationPlanReport";
import ResellerWiseListing from "./pages/Dashboard/components/ResellerWise/ResellerWiseList";
import LcoWiseCards from "./pages/Dashboard/components/LcoWise/LcoWiseCards";
import ResellerWiseDetails from "./pages/Dashboard/components/ResellerWise/ResellerWiseDetails";
import OpenTicketReport from "./pages/ReportPages/TicketReport/OpenTicket";
import ClosedTicketReport from "./pages/ReportPages/TicketReport/ClosedTicket";
import FixedTicketReport from "./pages/ReportPages/TicketReport/FixedTicket";
import AssignedTicketReport from "./pages/ReportPages/TicketReport/AssignTicket";
import NonAssignedTicketReport from "./pages/ReportPages/TicketReport/NonAssignTicket";
import ResolvedTicketReport from "./pages/ReportPages/TicketReport/ResolvedTicket";
import LcoWiseDetail from "./pages/Dashboard/components/LcoWise/LcoWiseDetail";
import DashboardBarUsers from "./pages/Dashboard/components/DateWiseDashboardDetails";
import DashboardDetails from "./pages/Dashboard/components/DashboardDetails";
import ReassignTicketList from "./pages/Ticket/RenewalTicket";
import TicketCreate from "./pages/Ticket/CreateTicket";
import TicketReplyOptionList from "./pages/Setting/TicketReplyOptionList";
import TicketReplyOptionUpdate from "./pages/Setting/TicketReplyOptionUpdate";
import PurchasedPlanList from "./pages/Invoice/PurchedPackageList";
import OttPackageList from "./pages/Invoice/OttPackageList";
import IptvPackageList from "./pages/Invoice/IptvPackageList";
import CompletePaymentList from "./pages/Payment/SuccessPayment";
import PendingPaymentList from "./pages/Payment/PendingPayment";
import TicketReplyOptionCreate from "./pages/Setting/TicketReplyOptionCreate";
import TicketResolutionOptionList from "./pages/Setting/TicketResolutionOptionList";
import TicketResolutionOptionCreate from "./pages/Setting/TicketResolutionOptionCreate";
import TicketResolutionOptionUpdate from "./pages/Setting/TicketResolutionOptionUpdate";
// import TicketDetails from "./pages/Ticket/TicketView";
import TicketDetails from "./pages/Ticket/TicketView";
import ProfileHeader from "./layout/ProfileHeader";
import Profile from "./pages/UserProfile/UserProfileDetails";
import UserInvoices from "./pages/UserProfile/Invoice";
import UserTickets from "./pages/UserProfile/Ticket";
import UserPayment from "./pages/UserProfile/Payment";
import UserRechargePackage from "./pages/UserProfile/Recharge";
import UserPackageDetails from "./pages/UserProfile/PackageDetails";
import UserLogs from "./pages/UserProfile/AcitivityLog";
import UserProfile from "./pages/UserProfile/UserProfileDetails";
import ConnectionRequestList from "./pages/connectionRequest/connectionRequestList";
import PackageUpdate from "./pages/Package/PackageUpdate";
// import Hello from "./pages/Package/OttPackageList";
// import UserRechargePackage from "./pages/UserProfile/Recharge";

// import UserList from "./pages/User/UserList";
export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Routes (Public) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reseller" element={<SignInReseller />} />
          <Route path="/staff" element={<SignInStaff />} />
          <Route path="/lco" element={<SignInLco />} />
          {/* Protected Dashboard Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* ------------------------------------------------------------dashboard Work------------------------------------------------------------ */}
            <Route
              path="reseller-wise-list/:type"
              element={<ResellerWiseListing />}
            />
            <Route
              path="reseller-wise-details/:type/:resellerId"
              element={<ResellerWiseDetails />}
            />
            <Route
              path="lco-wise-list/:type/:resellerId"
              element={<LcoWiseCards />}
            />
            <Route
              path="lco-wise-details/:type/:resellerId/:lcoId"
              element={<LcoWiseDetail />}
            />
            <Route path="/dashboard/details" element={<DashboardDetails />} />
            <Route
              path="/dashboard/chart-users"
              element={<DashboardBarUsers />}
            />
            <Route index element={<Home />} />
            <Route path="view-details" element={<ViewDetails />}></Route>
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />
            <Route path="form-elements" element={<FormElements />} />
            <Route path="basic-tables" element={<BasicTables />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} />
            <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} />
            {/* New Routes */}
            <Route path="user-list" element={<FormElements />} />

            {/*-------------------------------------------------------------------------User Profile Details ------------------------------------------------------------------------- */}

            <Route path="user/profile/:id" element={<ProfileHeader />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="invoice" element={<UserInvoices />} />
              <Route path="tickets" element={<UserTickets />} />
              <Route path="payment" element={<UserPayment />} />
              <Route
                path="recharge-package"
                element={<UserRechargePackage />}
              />
              <Route path="package-details" element={<UserPackageDetails />} />
              <Route path="activity-log" element={<UserLogs />} />
              {/* <Route path="recharge-package" element={<UserRechargePackage userId={"someValue"} />} /> */}
            </Route>

            {/* ------------------------------------------------------------Staff Routes------------------------------------------------------------ */}
            <Route path="staff/list" element={<StaffList />} />
            <Route path="staff/create" element={<StaffCreate />} />
            <Route path="staff/view/:id" element={<StaffView />} />
            <Route path="staff/update/:id" element={<StaffUpdate />} />
            {/*---------------------------------------------------------RETAILER  --------------------------------------------------------- */}
            {/* retailer Routes */}
            <Route path="retailer/list" element={<RetailerList />} />
            <Route path="retailer/create" element={<RetailerCreate />} />
            <Route path="retailer/list/:id" element={<RetailerView />} />
            <Route path="retailer/update/:id" element={<RetailerUpdate />} />
            {/* Assign Package to the retailer */}
            <Route
              path="/retailer/assignPackage/:id"
              element={<AssignPackage />}
            />
            <Route
              path="/retailer/assignPackage/list/:id"
              element={<AssignPackageList />}
            />
            <Route
              path="/retailer/assignPackage/view/:resellerId/:packageId"
              element={<ViewAssignedPackage />}
            />
            {/* this is for manage the wallet of the retailer */}
            <Route
              path="/retailer/wallet/list/:id"
              element={<RetailerWalletList />}
            />
            <Route
              path="/retailer/wallet/create/:id"
              element={<RetailerWalletCreate />}
            />
            <Route
              path="/retailer/wallet/view/:id/:transactionId"
              element={<RetailerWalletView />}
            />
            {/* this is for the employee inside the retailer */}
            <Route
              path="/retailer/employee/list/:id"
              element={<RetailerEmployeeList />}
            />
            <Route
              path="/retailer/employee/create/:lcoId"
              element={<RetailerEmployeeCreate />}
            />
            <Route
              path="/retailer/employee/update/:lcoId/:empId"
              element={<ResellerEmployeeUpdate />}
            />
            {/*---------------------------------------------------------LCO  --------------------------------------------------------- */}
            {/* lco Routes */}
            <Route path="lco/list" element={<LcoList />} />
            <Route path="lco/create" element={<CreateLco />} />
            <Route path="lco/list/:id" element={<LcoDetails />} />
            <Route path="lco/update/:id" element={<LcoUpdate />} />
            {/* Assign Package to the retailer */}
            <Route path="/lco/assignPackage/:id" element={<AssignPackage />} />
            <Route
              path="/lco/assignPackage/list/:id"
              element={<LcoAssignPackageList />}
            />
            <Route
              path="/lco/assignPackage/view/:resellerId/:packageId"
              element={<ViewAssignedPackage />}
            />
            {/* manage LCO wallet */}
            <Route path="/lco/wallet/list/:id" element={<LcoWalletList />} />
            <Route
              path="/lco/wallet/create/:id"
              element={<LcoWalletCreate />}
            />
            <Route
              path="/lco/wallet/view/:id/:transactionId"
              element={<LcoWalletView />}
            />
            <Route
              path="/lco/wallet/update/:id/:transactionId"
              element={<LcoWalletUpdate />}
            />
            {/* this is for the employee inside the retailer */}
            <Route
              path="/lco/employee/list/:id"
              element={<LcoEmployeeList />}
            />
            <Route
              path="/lco/employee/create/:resellerId"
              element={<LcoEmployeeCreate />}
            />
            <Route
              path="/lco/employee/update/:retailerId/:empId"
              element={<LcoEmployeeUpdate />}
            />
            {/* package Routes */}
            <Route path="package/list" element={<PackageList />} />
            <Route path="package/list/:id" element={<PackageDetails />} />
            <Route path="package/create" element={<PackageCreate />} />
            <Route path="package/update/:id" element={<PackageUpdate />} />
            {/* <Route path="/package/ott-list" element={<Hello />} /> */}
            {/* <Route path="/package/iptv-list" element={< />} /> */}
            {/*----------------------------------------------------------------------------------------------Customer Routes ----------------------------------------------------------------------------------------------*/}
            <Route path="user/list" element={<CustomerList />} />
            <Route path="user/create" element={<CreateUser />} />
            <Route path="user/:id" element={<UserDetails />} />
            <Route path="user/update/:id" element={<CustomerUpdate />} />
            {/* Role Permission */}
            <Route path="role/list" element={<RoleList />} />
            <Route path="/role/create" element={<CreateRole />} />
            <Route path="/role/:id" element={<ViewRoleDetail />} />
            <Route path="/role/update/:id" element={<UpdateRole />} />
            {/* this is for the listing of the ticket */}
            {/* this is for the setting of the ticket */}
            <Route path="/setting/jon" element={<Jon />} />
            <Route
              path="/setting/ticketcattogry"
              element={<TicketCattogry />}
            />
            {/*----------------------------------------------------------------------------------------------Zone Routes ----------------------------------------------------------------------------------------------*/}
            <Route path="/setting/zonelist" element={<ZoneList />} />
            <Route path="/setting/zone/create" element={<ZoneCreate />} />
            <Route path="/setting/zone/update" element={<ZoneUpdate />} />
            {/*----------------------------------------------------------------------------------------------hardware Routes ----------------------------------------------------------------------------------------------*/}
            <Route path="/setting/hardware/list" element={<HardwareList />} />
            <Route
              path="/setting/hardware/create"
              element={<HardwareCreate />}
            />
            <Route
              path="/setting/hardware/view/:id"
              element={<HardwareView />}
            />
            <Route
              path="/setting/hardware/update/:id"
              element={<HardwareUpdate />}
            />
            {/*---------------------------------------------------------ticket reply--------------------------------------------- */}
            <Route
              path="/setting/ticketReplyOption/list"
              element={<TicketReplyOptionList />}
            />
            <Route
              path="/setting/ticketReplyOption/create"
              element={<TicketReplyOptionCreate />}
            />
            <Route
              path="/setting/ticketReplyOption/update/:id"
              element={<TicketReplyOptionUpdate />}
            />

            {/* --------------------------------------resolution----------------------------------------- */}
            <Route
              path="/setting/resolution/list"
              element={<TicketResolutionOptionList />}
            ></Route>
            <Route
              path="/setting/resolution/create"
              element={<TicketResolutionOptionCreate />}
            ></Route>
            <Route
              path="/setting/resolution/update/:id"
              element={<TicketResolutionOptionUpdate />}
            ></Route>

            {/* this is for the setting end of the ticket */}
            <Route path="/ticket/renewal" element={<ReassignTicketList />} />
            <Route path="/ticket/close" element={<CloseTicket />} />
            <Route path="/ticket/manage" element={<ManageTicket />} />
            <Route path="/ticket/all" element={<AllTicket />} />
            <Route path="/ticket/approval" element={<ApprovelTicket />} />
            <Route path="/ticket/create" element={<TicketCreate />} />
            <Route path="/ticket/view/:id" element={<TicketDetails />} />

            {/*---------------------------------------------------------Price Book  --------------------------------------------------------- */}
            <Route path="/pricebook/list" element={<PriceBookList />} />
            <Route path="/pricebook/create" element={<PriceBookCreate />} />
            <Route path="/pricebook/view/:id" element={<PriceBookView />} />
            <Route path="/pricebook/update/:id" element={<PriceBookUpdate />} />

            {/*----------------------------------------------------------payment------------------------------------------------------------ */}

            <Route path="/received/payment" element={<CompletePaymentList />} />
            <Route path="/pending/payment" element={<PendingPaymentList />} />

            {/*--------------------------puched plan list-------------------------------------------------------------------*/}

            <Route
              path="/invoice/package-recharge"
              element={<PurchasedPlanList />}
            />
            <Route path="/invoice/ott-recharge" element={<OttPackageList />} />
            <Route
              path="/invoice/iptv-recharge"
              element={<IptvPackageList />}
            />

            {/*-------------------------------------------------------------------------config list ------------------------------------------------------------------------- */}
            <Route path="/config/list" element={<RoleConfigList />} />
            <Route path="/config/create" element={<RoleConfigCreate />} />
            <Route path="/config/view/:id" element={<RoleConfigDetail />} />
            <Route path="/config/update/:id" element={<RoleConfigUpdate />} />
            {/*-------------------------------------------------------------------------Report list ------------------------------------------------------------------------- */}
            <Route path="/report/list" element={<ReportList />} />

            {/*-----------------------------connectionRequest---------------------------- */}

            <Route
              path="/connection-request"
              element={<ConnectionRequestList />}
            />

            {/*-------------------------------------------------------------------------Subscriber Report list ------------------------------------------------------------------------- */}
            <Route
              path="/report/account-wise-profile-report/list"
              element={<AccountWiseProfileReport />}
            />
            <Route
              path="/report/inactive-customer-report/list"
              element={<InactiveCustomerReport />}
            />
            <Route
              path="/report/all-suspended-user/list"
              element={<SuspendedCustomerReport />}
            />
            {/*-------------------------------------------------------------------------Franchisee Report list ------------------------------------------------------------------------- */}
            <Route
              path="/report/lco-balance-transfer-history/list"
              element={<LcoBalanceTransferHistory />}
            />
            <Route
              path="/report/lco-transaction-history/list"
              element={<LcoTransactionHistory />}
            />
            <Route
              path="/report/lco-transaction-history/list"
              element={<LcoTransactionHistory />}
            />
            <Route
              path="/report/online-transaction/list"
              element={<OnlineTransaction />}
            />
            <Route
              path="/report/reseller-transfer-balance/list"
              element={<ResellerTransferBalance />}
            />
            {/*-------------------------------------------------------------------------MIS Report list ------------------------------------------------------------------------- */}
            <Route
              path="/report/customer-balance-report"
              element={<CustomerBalanceReport />}
            />
            <Route
              path="/report/customer-update-history"
              element={<CustomerUpdateHistory />}
            />
            <Route
              path="/report/upcoming-renewal-by-days"
              element={<UpcomingRenewalByDays />}
            />
            <Route
              path="/report/upcoming-renewal-by-month"
              element={<UpcomingRenewalByMonth />}
            />
            {/*-------------------------------------------------------------------------Revenue Report list ------------------------------------------------------------------------- */}
            <Route
              path="/report/new-registration-plan-report"
              element={<NewRegistrationPlanReport />}
            />
            <Route
              path="/report/recent-purchased-or-renew-report"
              element={<RecentPurchasedOrRenewReport />}
            />
            <Route path="/report/payment-report" element={<PaymentReport />} />
            {/*-------------------------------------------------------------------------Ticket Report list ------------------------------------------------------------------------- */}
            <Route
              path="/report/open-ticket-report"
              element={<OpenTicketReport />}
            />
            <Route
              path="/report/closed-ticket-report"
              element={<ClosedTicketReport />}
            />
            <Route
              path="/report/fixed-ticket-report"
              element={<FixedTicketReport />}
            />
            <Route
              path="/report/assigned-ticket-report"
              element={<AssignedTicketReport />}
            />
            <Route
              path="/report/unassigned-ticket-report"
              element={<NonAssignedTicketReport />}
            />
            <Route
              path="/report/resolved-ticket-report"
              element={<ResolvedTicketReport />}
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Toast Container (Global) */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: "70px" }}
        />
      </Router>
    </>
  );
}
