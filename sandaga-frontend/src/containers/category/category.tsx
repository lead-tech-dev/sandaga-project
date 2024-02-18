import React, {FunctionComponent} from 'react';
import {CategoryInterface} from "../../interfaces/ads.interface";
import Category from "../../components/category/Category";

interface CategoryContainerProps {
    categories: CategoryInterface[];
}
const CategoryContainer: FunctionComponent<CategoryContainerProps> = ({ categories }) => {
    return (
        <div className="categories_wrapper">
            <div className="category-list">
                <div className="items">
                    {categories.map((item, index) => (
                        <Category category={item} key={index}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryContainer;