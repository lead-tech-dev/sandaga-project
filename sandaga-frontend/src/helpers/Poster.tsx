import {CategoryInterface, CriteriaInterface, FieldsInterface, SubCategoryInterface} from "../interfaces/ads.interface";


export const getCategoriesDataByAccountType = (
    categories: CategoryInterface[],
    accountType: number
): CategoryInterface[] => {
    let currentCategory = [] as CategoryInterface[];
    categories.forEach((item: CategoryInterface) => {
        let currentSubCategory = [] as SubCategoryInterface[];

        item.subcategories.forEach((subCat: SubCategoryInterface) => {
            if (
                Object.keys(Object.values(subCat.rights)[accountType]).length >
                0
            ) {
                currentSubCategory.push(subCat);
            }
        });
        currentCategory.push({
            id: item.id,
            label: item.label,
            name: item.name,
            channel: item.channel,
            ad_types: item.ad_types,
            img: item.img,
            subcategories: currentSubCategory,
        });
    });

    return currentCategory;
};

export const getCategoryById = (
    categories: CategoryInterface[],
    id: string,
): CategoryInterface => {
   let category: any;
    categories.forEach((item: CategoryInterface) => {
        if (item.id === id) {
            category = item;
        }
    });

    return category;
};

export const getSubCategoryById = (
    categories: CategoryInterface[],
    id: string | undefined,
): { subcategory: SubCategoryInterface; category: CategoryInterface } => {

    let data: any;
    categories.forEach((item: CategoryInterface) => {
            item.subcategories.forEach((subCat: SubCategoryInterface) => {
                if (subCat.id === id) {
                    data = {subcategory: subCat, category: item}
                }
            })

    });


    return data;
};


export const getCategoryCriteria = (
    criteria: CriteriaInterface,
    category: SubCategoryInterface
): FieldsInterface[] => {
    let criterias: FieldsInterface[] = [];

        if (criteria["private"] && Object.keys(criteria["private"][category.id]).includes("sell")) {
            let fields: FieldsInterface[] | undefined = Object.values(criteria["private"][category.id])[0][0].fields

            Object.values(criteria["private"][category.id])[0].length > 4 &&
               fields && fields.filter(item => !Object.keys(item).includes("depends_on")).forEach(item => {
                   if (item["name"] !== "bicycode") {
                       criterias = [...criterias, item]
                   }
                });



        }else if (criteria["pro"] && Object.keys(criteria["pro"][category.id]).includes("sell")){
            let fields: FieldsInterface[] | undefined = Object.values(criteria["pro"][category.id])[0][0].fields
            Object.values(criteria["pro"][category.id])[0].length > 4 &&
            fields && fields.filter(item => !Object.keys(item).includes("depends_on")).forEach(item => {
                criterias = [...criterias, item]
            });
        }

    return criterias;

}

export const convertCriteria = (
    criteriaApi: {[key: string]: string},
    criteria: FieldsInterface[]
): {[key: string]: string} => {
    let data = {} as {[key: string]: string}

    criteria.forEach(item => {
        Object.keys(criteriaApi).forEach(cr => {
            if (item.name === cr) {
                data = {...data, [item.label]: criteriaApi[cr]}
            }
        })
    })

    return data;
}

export const exitsCategory = (id: string, categories: CategoryInterface[]): { exist: boolean, type: string } => {
    let exists: { exist: boolean, type: string } = {exist: false, type: "subcategory"};


        categories.forEach((item) => {
            if (item.id === id) {
                exists = {...exists, exist: true, type: "category"}
            }else {
                item.subcategories.forEach(sub => {
                    if (sub.id === id) {
                        exists = {...exists, exist: true, type: "subcategory"}
                    }
                })
            }
        })
    return exists
}

export const createQueryParams = (urls: {[key: string]: string}, store: any) => {
    let queryParams = {} as { [key: string]: string };
    let data = ["category", "text", "location", "min", "max", "sort", "order", "page"]


    if (urls.category && store.filters.category && store.filters.category !== urls.category) {

        queryParams = {...queryParams, category: urls.category}

        if (urls.text){
            queryParams = {...queryParams, text: urls.text}
        }

        if (urls.location){
            queryParams = {...queryParams, location: urls.location}
        }

    }else {
        if (urls.category){
            queryParams = {...queryParams, category: urls.category}
        }

        if (urls.text){
            queryParams = {...queryParams, text: urls.text}
        }

        if (urls.location){
            queryParams = {...queryParams, location: urls.location}
        }

        if (urls.min){
            queryParams = {...queryParams, min: urls.min}
        }

        if (urls.max){
            queryParams = {...queryParams, max: urls.max}
        }

        if (urls.sort){
            let sort = urls.sort.split("_");

            if (sort.length > 1) {
                queryParams = {...queryParams, sort: sort[0], order: sort[1]}
            }else {
                queryParams = {...queryParams, sort: urls.sort, order: urls.order}
            }
        }

        Object.keys(urls).forEach(item => {
            if (!data.includes(item)) {
                queryParams = {...queryParams, [item]: urls[item]}
            }
        })

        if (urls.page){
            queryParams = {...queryParams, page: urls.page}
        }

    }

    const queryAllParams = [];
    for (let i in queryParams) {
        queryAllParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(queryParams[i]))
    }

    return queryAllParams.join('&')

}

export const getUrls = (query: any): {[key: string]: string} => {

    let urls = {} as {[key: string]: string};

    for (let param of query.entries()) {
        urls[param[0]] = param[1];
    }

    return urls;
}

