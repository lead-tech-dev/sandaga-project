import {FavoritesProps} from "../redux/reducers/auth.reducer";


export const isFollowing = (id: string | undefined, followings: {id: string, name: string}[]): boolean => {
    let isFollow = false as boolean;

    id !== undefined && followings && followings.length > 0 && followings.forEach(item => {
        if (item.id === id) isFollow = true;
        return;
    })

    return isFollow;
}

export const filterAds = (ads: any, status: string): any => {
    let localAds = [];

    if (status === 'active') {
        localAds =  ads.filter((item:any ) => item.status === "active")
    } else if (status === 'inactive') {
        localAds = ads.filter((item:any ) => item.status === "inactive")
    }else if (status === "delete") {
        localAds = ads.filter((item:any ) => item.status === "delete");
    }else {
        localAds = [...ads]
    }


    return localAds;
}

export const isFavorites = (id: string | undefined, favorites: any): boolean => {
    let isFavorite = false as boolean;

    id !== undefined && favorites && favorites.length > 0 && favorites.forEach((item: any) => {
        if (item.adsId === id) isFavorite = true;
        return;
    })

    return isFavorite;
}

export const getFavoriteByAdId = (adId: string | undefined, favorites: any): FavoritesProps | null => {
    let favorite = null as FavoritesProps | null;

    adId !== undefined && favorites && favorites.length > 0 && favorites.forEach((item: any) => {
        if (item.adsId === adId) favorite = item;
        return;
    })

    return favorite;
}
