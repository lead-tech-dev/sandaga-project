import React, {Fragment} from "react";
import {SEO} from "../components/seo";
import {Link} from "react-router-dom";

const Unauthorized = () => {
    return (
       <Fragment>
           <SEO title="404 - Sandaga" description="Page introuvable" />
           <div className="error-area pt-40 pb-100">
               <div className="container">
                   <div className="row justify-content-center">
                       <div className="col-xl-7 col-lg-8 text-center">
                           <div className="error-404">
                               <h1>404</h1>
                               <h2>OPPS! PAGE INTROUVABLE</h2>
                               <p>
                                   Désolé mais la page que vous recherchez n'existe pas, a été supprimée, son nom a été modifié ou est temporairement indisponible.
                               </p>
                               {/*<form className="searchform mb-50">
                                   <input
                                       type="text"
                                       name="search"
                                       id="error_search"
                                       placeholder="Search..."
                                       className="searchform__input"
                                   />
                                   <button type="submit" className="searchform__submit">
                                       <i className="fa fa-search" />
                                   </button>
                               </form>*/}
                               <Link to={process.env.PUBLIC_URL + "/"} className="error-btn">
                                   Retour à la page d'accueil
                               </Link>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </Fragment>
    )
}
export  default Unauthorized;