import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layouts/Layout";
import Signin from "./pages/Signin";
import Signup from "./pages/Siignup";
import ForgotPassword from "./pages/Forgot-password";
import Unauthorized from "./pages/Unauthorized";
import AuthRoute from "./helpers/AuthRoute";
import Home from "./pages/Home";
import NotAuthRoute from "./helpers/NotAuthRoute";
import Admin from "./pages/Admin";
import ScrollToTop from "./hooks/useScrollToTop";
import Confirmation from "./pages/Confirmation";
import ResetPassword from "./pages/ResetPassword";
import Poster from "./pages/Poster";
import {getAuthUserData, refreshExpiredToken} from "./redux/actions/auth.actions";
import { Dispatch } from "redux";
import {connect, ConnectedProps} from "react-redux";
import Search from "./pages/Search";
import Adv from "./pages/Adv";
import Profile from "./pages/Profile";
import Ads from "./components/accounts/ads/Ads";
import Favorite from "./components/accounts/favorite/Favorite";
import Searches from "./components/accounts/search/Searches";
import Payment from "./components/accounts/payment/Payment";
import Messenger from "./components/accounts/messenger/Messenger";
import MyAccount from "./components/accounts/profile/My-Account";
import Conversation from "./components/accounts/messenger/Conversation";
import Editer from "./components/accounts/ads/Editer";
import Buy from "./components/payment/Buy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Condition from "./pages/Condition";
import Privacy from "./pages/Privacy";
import Dashboard from "./components/accounts/dashboard/dashboard";
import StripeConnect from "./pages/StripeConnect";



const ROLES = {
  ROLE_USER: "ROLE_USER",
  ROLE_ADMIN: "ROLE_ADMIN",
};

const App: FunctionComponent<AppProps> = () => {
    //const getTokenExpired= useCallback(() => {tokenExpired()}, [])
  const [stripe, setStripe] = useState<any>("");



  return (
      <BreadcrumbsProvider>
      <Router>
        <ScrollToTop>
        <AnimatePresence mode={"wait"}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Unauthorized />} />
              <Route path="/recherche" element={<Search />} />
              <Route path="/adv/:id" element={<Adv />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/qui-sommes-nous" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/conditions-generales-d-utilisation" element={<Condition />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/seller/stripe/connect" element={<StripeConnect />} />

              <Route element={<NotAuthRoute />}>
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify" element={<Confirmation />} />
                <Route path="login" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* we want to protect these routes */}
              <Route element={<AuthRoute allowedRoles={[ROLES.ROLE_USER, ROLES.ROLE_ADMIN]} />}>
                <Route path="/dashboard" element={<Admin />} >
                  <Route index element={<Dashboard />}/>
                  <Route path="mon-profile" element={<MyAccount/>}/>
                  <Route path="mes-annonces" element={<Ads/>}>
                    <Route path=":adsId/edit" element={<Editer/>}/>
                  </Route>
                  <Route path="mes-favoris" element={<Favorite/>}/>
                  <Route path="mes-recherches" element={<Searches/>}/>
                  <Route path="mes-paiements" element={<Payment/>}/>
                  <Route path="mes-messages" element={<Messenger/>}>
                    <Route path=":messageId" element={<Conversation/>}/>
                  </Route>
                </Route>
                <Route path="/poster-une-annonce" element={<Poster />} />

                <Route path="/buy/:id" element={<Buy />} />


              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
        </ScrollToTop>
      </Router>
      </BreadcrumbsProvider>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  refreshExpiredToken: () => dispatch(refreshExpiredToken()),
  getAuthUserData: () => dispatch(getAuthUserData()),
});

const connector = connect(null, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;

export default connector(App);
