import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Home from "./pages/Dashboard/Home";
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


          {/* Protected Dashboard Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
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

            <Route path="staff/list" element={<StaffList />} />

            {/* retailer Routes */}
            <Route path="retailer/list" element={<RetailerList/>} />
            <Route path="retailer/create" element={<RetailerCreate/>} />
             <Route path="retailer/list/:id" element={<RetailerView/>} />
             <Route path="retailer/update/:id" element={<RetailerUpdate/>} />

             {/* lco Routes */}
             <Route path="lco/list" element={<LcoList/>} />
             <Route path="lco/create" element={<CreateLco/>} />
             <Route path="lco/list/:id" element={<LcoDetails/>} />

             {/* package Routes */}
              <Route path="package/list" element={<PackageList/>} />
              <Route path="package/list/:id" element={<PackageDetails/>} />
              <Route path="package/create" element={<PackageCreate/>} />

               {/*Customer Routes */}
              <Route path="user/list" element={<CustomerList/>} />
               <Route path="user/create" element={<CreateUser/>} />
              <Route path="user/:id" element={<UserDetails/>} />
             
        
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
