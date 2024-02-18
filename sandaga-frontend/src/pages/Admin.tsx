import React, { Fragment, FunctionComponent } from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import {SEO} from "../components/seo";

const li = [
  {
    id: 1,
    link: "/dashboard",
    label: "Dashboard",
    pane: 'dashboard'
  },
  {
    id: 2,
    link: "/dashboard/mon-profile",
    label: "Mon profile",
    pane: 'mon-profile'
  },
  {
    id: 3,
    link: "/dashboard/mes-annonces",
    label: "Mes annonces",
    pane: 'mes-annonces'

  },
  {
    id: 4,
    link: "/dashboard/mes-favoris",
    label: "Mes favoris",
    pane: 'mes-favoris'
  },
  {
    id: 5,
    link: "/dashboard/mes-messages",
    label: "Mes messages",
    pane: 'mes-messages'
  } ,
  {
    id: 6,
    link: "/dashboard/mes-paiements",
    label: "Mes paiements",
    pane: 'mes-paiements'
  },
  {
    id: 7,
    link: "/dashboard/mes-recherches",
    label: "Mes recherches",
    pane: 'mes-recherches'
  }];

interface AdminProps {}
const Admin: FunctionComponent<AdminProps> = ({}) => {
  const location = useLocation();
  const handleClick = (e: any) => {
    e.preventDefault();
    const collapse = document.querySelector(".menu-options");
    collapse?.classList.toggle("show");

    const liActive = document
        .querySelector(".account-nav-mobile")
        ?.querySelectorAll("li.active");

    if (e.target.dataset.target !== "#menu-options") {
      liActive?.forEach((item) => {
        item.classList.remove("active");
      });
      e.target.parentNode.classList.add("active");

      console.log(e.target)
     // document.querySelector(e.target.dataset.target).classList.add("active");
    }
  };

  return (
    <Fragment>
      <SEO title={`${location.pathname.split("/").length > 2 ? location.pathname.split("/")[2].split("-").join(" ")[0].toUpperCase() +
      location.pathname.split("/")[2].split("-").join(" ").substring(1) : "Mon profile"
      } - Sandaga`} description="Mon compte" />
      <section className="bkg-light medium boxed">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="boxed-container my-account">
                <div className="account-nav">
                  <ul className="subnav justify-content-center align-self-center h-100">
                    {li
                        .map((tab, index) => (
                            <li className={`my-auto ${tab.pane === location.pathname.split("/")[2] || location.pathname === "/dashboard" && index === 0 ? 'active' : ''}`} key={index} value={tab.id}>
                              <Link to={{pathname: tab.link}} >{tab.label}</Link></li>
                        ))}
                  </ul>
                </div>
                <div className={`account-nav-mobile ${location.pathname.split("/")[2] === "mes-messages" ? "hide": ""}`} onClick={(e) => handleClick(e)}>
                  <ul>
                    {
                      li.map((tab, index) => (
                          <li className={tab.pane === location.pathname.split("/")[2] || location.pathname === "/dashboard" && index === 0 ?'active' : ''} key={index}><a href="#@" data-toggle="collapse"
                                                                                                        data-target="#menu-options" aria-expanded="false"
                                                                                                        className="collapsed">{tab.label}</a></li>
                      ))
                    }
                  </ul>
                  <div id="menu-options" className="menu-options collapse" aria-expanded="false">
                    <ul>
                      {
                        li.map((tab, index) =>(
                            <li className={tab.link === location.pathname ? 'active' : ''} key={index}><Link to={{pathname: tab.link}}>{tab.label}</Link></li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
                <Outlet/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};


export default Admin;
