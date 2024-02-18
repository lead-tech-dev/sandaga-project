import React, {FunctionComponent, useEffect} from 'react';
import {CategoryInterface} from "../../interfaces/ads.interface";
import {Link} from "react-router-dom";
import "./category.style.scss";

interface CategoryProps {
    category: CategoryInterface
}
const Category: FunctionComponent<CategoryProps> = ({category: {id, img, label, subcategories}}) => {

    useEffect(() => {
        const items: NodeListOf<HTMLElement> = document.querySelectorAll(".item");

        items.forEach((item) => {
            item.addEventListener("click", (e) => handleClick(e));
        });


    }, []);

    const removeElement = (el: HTMLElement) => {

            if (el.classList.contains("show")) {
                el.parentElement?.classList.remove("margin");
                el.classList.remove("show");
                el.nextElementSibling?.classList.remove("show");
            }

    };

    const handleClick = (e: any) => {
        e.preventDefault();

        const show: NodeListOf<HTMLElement> = document.querySelectorAll(".item");

         if (e.currentTarget.classList.contains("item")) {
             show.forEach((el) => {
                 removeElement(el);
             })

            e?.currentTarget?.parentElement?.classList.add("margin");
            e?.currentTarget?.classList.add("show");
            e?.currentTarget?.nextElementSibling?.classList.add("show");
            e.stopPropagation();
        } else {
             show.forEach((el) => {
                 removeElement(el);
             })
        }
    };

    const handleBlur = (e: any) => {
        console.log(e.currentTarget)
        //removeElement(e.currentTarget);
    }

    return (
        <div className={`inner-item item-mb-${
            subcategories.length < 3 ? "2" : 
                subcategories.length < 5 ? "4" : 
                    subcategories.length < 7 ? "6" : subcategories.length < 9 ? "8" : "10"}`
        }
        >
            <div className="item" onBlur={(e) => handleBlur(e)}>
                <a href="@#">
                        <span className="icon">
                          <img src={img} aria-hidden="true" alt="" />
                        </span>
                    <h6>{label}</h6>
                </a>
                {/* <span className="counter">(1125)</span> */}
            </div>
            <div className="sub-item">
                <Link to={`/recherche?category=${id}`} className="more-categories">
                    afficher toutes les annonces de la catégorie
                    <span className="more-categories_count">{/*(6.501)*/}</span>
                </Link>
                <div className="more-categories_hr"></div>
                <ul className={`sub-item-ul`}>
                    {subcategories.map((sub, index) => (
                        <li key={index}>
                            <Link to={`/recherche?category=${sub.id}`}>{sub.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Category;