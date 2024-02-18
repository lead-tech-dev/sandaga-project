import React, {Fragment} from 'react';
import "./privacy.style.scss"
import {SEO} from "../seo";
import SectionTitle from "../section-title/section-title";

const Privacies = () => {
    return (
        <Fragment>
            <SEO title="Privacy - Sandaga" description="Privacy" />
            <div className="privacy-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header">
                                <SectionTitle
                                    titleText="Privacy"
                                    positionClass="left"
                                    spaceClass="mt-15"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="content">
                            <p>Bienvenue sur <span>Buy & Salam</span>, votre site de petites annonces gratuit !</p>
                            <p>Chez <span>Buy & Salam</span>, nous accordons une importance capitale à la confidentialité et à la protection de vos données personnelles. Cette page de confidentialité a pour but de vous informer sur la manière dont nous recueillons, utilisons, partageons et protégeons vos informations lorsque vous naviguez sur notre plateforme.</p>
                            <ul>
                                <li>Collecte des informations :</li>
                                <li>Lorsque vous utilisez notre site, nous pouvons être amenés à collecter certaines informations vous concernant. Cela inclut, sans s'y limiter, votre nom, adresse e-mail, numéro de téléphone, localisation géographique et d'autres données nécessaires à la création de votre compte et à la publication de vos annonces. Soyez assuré que nous ne collectons que les données pertinentes et nécessaires pour améliorer votre expérience sur notre plateforme.</li>
                                <li>Utilisation des informations :</li>
                                <li>Nous utilisons vos informations personnelles uniquement dans le cadre de vous fournir nos services. Cela comprend la gestion de votre compte, la publication de vos annonces, la communication avec vous concernant vos transactions, la personnalisation de votre expérience utilisateur, et pour répondre à vos questions et requêtes.</li>
                                <li>Partage des informations :</li>
                                <li>Nous comprenons à quel point vos informations personnelles sont sensibles, c'est pourquoi nous nous engageons à ne jamais les vendre, les louer ou les divulguer à des tiers à des fins de marketing sans votre consentement explicite. Cependant, nous pouvons être amenés à partager certaines informations avec des prestataires de services tiers qui nous aident à exploiter notre plateforme et à fournir nos services. Ces prestataires sont soumis à des obligations strictes de confidentialité et ne sont autorisés à utiliser vos informations que dans le cadre de leurs services pour <span>Buy & Salam</span>.</li>
                                <li>Sécurité des données :</li>
                                <li>La sécurité de vos données est primordiale pour nous. Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos informations contre toute utilisation abusive, perte, accès non autorisé, divulgation ou altération. Cependant, il est essentiel de se rappeler qu'aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée, et nous ne pouvons pas garantir une sécurité absolue.</li>
                                <li>Cookies et technologies similaires :</li>
                                <li>Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site. Les cookies nous aident à mémoriser vos préférences, à suivre les tendances d'utilisation et à collecter des informations statistiques sur notre site. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</li>
                                <li>Mineurs :</li>
                                <li>Notre site n'est pas destiné aux mineurs de moins de 18 ans, et nous ne collectons pas sciemment des informations auprès d'eux. Si vous avez moins de 18 ans, veuillez ne pas fournir vos informations personnelles sur notre site.</li>
                                <li>Modifications de la politique de confidentialité :</li>
                                <li>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Veuillez consulter régulièrement cette page pour vous tenir informé des éventuelles modifications.</li>
                            </ul>
                            <p>Nous vous remercions d'avoir choisi Privu pour vos petites annonces en vidéo. Si vous avez des questions concernant notre politique de confidentialité ou si vous souhaitez exercer vos droits concernant vos données personnelles, n'hésitez pas à nous contacter via notre page de contact.
                                L'équipe <span>Buy & Salam</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Privacies;