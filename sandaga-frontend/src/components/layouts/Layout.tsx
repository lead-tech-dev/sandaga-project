import React, { FunctionComponent, Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/*interface TokenProps {
    refreshToken: string;
    accessToken: string;
    username: string;
    email: string;
    id: string;
    firstname: string;
    lastname: string;
    role: string;
}*/
interface LayoutProps {

}
const Layout: FunctionComponent<LayoutProps> = () => {
  return (
    <Fragment>
      <Header />
      <Outlet />
      <Footer />
    </Fragment>
  );
};

export default Layout;
