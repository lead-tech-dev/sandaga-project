import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {SEO} from "../components/seo";

const About = () => {
    return (
       <Fragment>
           <SEO title="Apropos - Sandaga" description="Apropos de nous" />
           <div className="about-wrapper">
               <div className="container">
                   <div className="row">
                       <div className="hero-wrapper">
                           <div className="hero-content">
                               <h1>A propos de Buy & Salam</h1>
                               <h3>Nous sommes Buy & Salam, une plateforme de petites annonces en ligne qui séduit des millions de personnes chaque semaine.</h3>
                               <h3>Nous sommes là pour vous aider à promouvoir vos biens et services en toute sécurité.</h3>
                           </div>
                       </div>
                   </div>

                   <div className="row">
                       <div className="our-mission">
                           <div className="img">
                               <img src="/assets/images/banner/Mission.jpg"/>
                           </div>
                           <div className="paymentLeft">
                               <h2>Notre Mission</h2>
                               <p>Notre ambition est de vous fournir la plateforme la plus sûre du monde.</p>
                               <p>Notre engagement ? Faire de votre sécurité une priorité.</p>
                               <p>Que ce soit par le biais de l'évolution constante de nos techniques de modération,
                                   de nos relations avec des partenaires clés ou de nos diverses méthodes de vérification,
                                   chaque décision que nous prenons est avant tout pour assurer votre tranquillité d'esprit.</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </Fragment>
    );
};

export default About;