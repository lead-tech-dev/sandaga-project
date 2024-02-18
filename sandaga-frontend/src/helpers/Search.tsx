import {RecentSearchInterface} from "../redux/reducers/search.reducer";


export const getCriteria = (urls: {[key: string]: string}): any => {
    let params = ["category", "location", "text", "min", "max", "sort", "order", "page"]
    let criterias = {} as { [key: string]: string };


    Object.keys(urls).forEach(cr => {

        if (!params.includes(cr)) {
            criterias = {...criterias, [cr]: urls[cr]}
        }
    })

    return criterias
}

export const constructLocation = (location: string): any => {
    let localLocation = location.split("_");
    let city = localLocation[0];
    let lat = localLocation[1];
    let lng = localLocation[2];
    let radius = localLocation[3];

    return {point:{ lat: parseFloat(lat), lng: parseFloat(lng), radius: parseInt(radius)}, city: city}
}

export const toArray = (state: RecentSearchInterface): {[key: string]: string}[] => {
    let array = [] as {[key: string]: string}[]

    if (state.filters.category) {
        array = [...array, {category: state.filters.category}]
    }

    if (state.filters.location) {
        array = [...array, {city: state.filters.location.city, point: state.filters.location.point}]
    }

    if (state.filters.keywords) {
        array = [...array, {text: state.filters.keywords.text}]
    }

    if (state.filters.ranges && state.filters.ranges.price) {
        if (state.filters.ranges.price.min) {
            array = [...array, {min: state.filters.ranges.price.min}]
        }

        if (state.filters.ranges.price.max) {
            array = [...array, {max: state.filters.ranges.price.max}]
        }
    }

    if (state.filters.criteria) {
        Object.keys(state.filters.criteria).forEach(item => {
            array = [...array, {[item]: state.filters.criteria[item]}]
        })
    }

    return array;
}
export const equalCriteria = (current: RecentSearchInterface, state: RecentSearchInterface) => {
    let currentArray = toArray(current);
    let stateArray = toArray(state);

    return JSON.stringify(currentArray) === JSON.stringify(stateArray);
}

export const isEqualCategoryAndKeywords = (current: RecentSearchInterface, state: RecentSearchInterface) => {
    let equal = false;

    if (current.filters.category && state.filters.category || current.filters.keywords && state.filters.keywords) {
        if (current.filters.category === state.filters.category || current.filters.keywords.text === state.filters.keywords.text) {
            equal = true;
        }
    }

    return equal;
}

export const storeFilters = (state: RecentSearchInterface, urls: { [key: string]: string }): any => {
    let recent: any = {filters: {criteria: {ad_type: "sell"}}, limit: 20, order: "desc", sort: "time", currentPage: 1}


    if (urls.page) {
        recent = {...recent, currentPage: urls.page}
    }

    if (urls.location) {
        let location = constructLocation(urls.location)

        let filters = {...recent.filters, location: location }
        recent = {...recent, filters: filters}
    }


    if (urls.category) {
        let filters = {...recent.filters, category: urls.category}
        recent = {...recent, filters: filters}

    }
    if (urls.min) {
        if (recent.filters.ranges) {
            recent.filters.ranges.price.min = urls.min;
        }else {
            recent.filters.ranges = {price: {}};
            recent.filters.ranges.price.min = urls.min;
        }
    }

    if (urls.max) {
        if (recent.filters.ranges) {
            recent.filters.ranges.price.max = urls.max
        }else {
            recent.filters.ranges = {price: {}};
            recent.filters.ranges.price.max = urls.max;
        }
    }
    if (urls.sort && urls.order) {

        recent = {...recent, sort: urls.sort, order: urls.order}
    }

    if (urls.text) {
        if (recent.filters.keywords) {
            recent.filters.keywords.text = urls.text
        }else {

            recent.filters.keywords = {}
            recent.filters.keywords.text = urls.text
        }
    }

    let criterias = getCriteria(urls)

    if (Object.keys(criterias).length > 0) {
        let criteria = {...recent.filters.criteria, ...criterias}
        let filters = {...recent.filters, criteria: criteria}

        recent = {...recent, filters: filters}
    }

    return recent;

}

export const urlsFilters = (state: RecentSearchInterface): {[key: string]: string} => {
    let urls = {} as {[key: string]: string}

    if (state.filters.category) {
        urls.category = state.filters.category;
    }

    if (state.filters.location) {
        urls.location = `${state.filters.location.city}_${state.filters.location.point.lat}_${state.filters.location.point.lng}_${state.filters.location.point.radius}`;
    }

    if (state.filters.keywords) {
        urls.text = state.filters.keywords.text;
    }

    if (state.filters.ranges && state.filters.ranges.price.min) {
        urls.min = state.filters.ranges.price.min;
    }

    if (state.filters.ranges && state.filters.ranges.price.max) {
        urls.max = state.filters.ranges.price.max;
    }

    if (state.filters.criteria) {
        Object.keys(state.filters.criteria).filter(item => item !== "ad_type").forEach(item => {
            urls[item] = state.filters.criteria[item]
        })
    }

    return urls;
}

/*export const saveUniqueFilters = (state: any, payload: any) => {
    let recent = [...state];

    if (recent.length > 0 && !equalCriteria(payload, recent[0])) {
        if (isEqualCategoryAndKeywords(payload, recent[0]) && recent.length <= 3) {
            recent.shift()
            recent.unshift(payload)
        } else  if (!isEqualCategoryAndKeywords(payload, recent[0]) && recent.length === 3) {
            recent.pop()
            recent.unshift(payload)
        }else if (!isEqualCategoryAndKeywords(payload, recent[0]) && recent.length < 3) {
            recent.unshift(payload)
        }
    }else {
        recent.push(payload)
    }

    return recent;
}*/

