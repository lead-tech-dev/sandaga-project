import React from "react";
import { categoriesData } from "../../data/data";
import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="block-navigation">
        <a href="#" className="btn btn-secondary back-to-top">
          <i className="fa fa-angle-up" />
        </a>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-4">
              <div className="logo">
                <a href="#">
                  <img
                    src="/assets/images/logo-light.png"
                    width=""
                    height=""
                    alt=""
                  />
                </a>
              </div>
              <p className="paymentLeft">
                BuyamSellam est une application qui vous permet d'acheter et de
                vendre en quelques clics.
              </p>
              <ul className="social">
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-facebook-square" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-instagram" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-twitter-square" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i
                      className="fa fa-google-plus-square"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-pinterest-square" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-linkedin" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank">
                    <i className="fa fa-vk" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-lg-8">
              <div className="row">
                <div className="col-12 col-md-4">
                  <div className="heading">Categories</div>
                  <ul>
                    {categoriesData.map((item: any, index: number) => (
                        <li key={index}>
                          <Link to={`/recherche?category=${item.id}`}>{item.label[0].toUpperCase() + item.label.substring(1).toLowerCase()}</Link>
                        </li>
                    ))}

                  </ul>
                </div>
                <div className="col-12 col-md-4">
                  <div className="heading">Aide</div>
                  <ul>
                    <li>
                      <Link to="/conditions-generales-d-utilisation">Conditions</Link>
                    </li>
                    <li>
                      <Link to="/privacy">Privacy Policy</Link>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-md-4">
                  <div className="heading">Nous connaître</div>
                  <ul>
                    <li>
                      <Link to="/qui-sommes-nous">Appropos de nous</Link>
                    </li>
                    <li>
                      <Link to="/contact">Nous contacter</Link>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block-copyright">
        <div className="container">
          <div className="row">
            <div className="col-12">
              2023 &copy; BuyamSellam par{" "}
              <a href="https://www.mj-tech.com/">Mj-Technologie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
