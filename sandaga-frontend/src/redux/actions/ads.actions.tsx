
import {
  ADS_URL,
  headersWithAuthorization,
} from "../../hooks/useConfig";
import { PostedAdsActionTypes } from "../types/ads.type";
import {deleteImage, uploadImage} from "./image.actions";

export const addAds =
   (formData: any, images: { [key: string]: File }) => (dispatch: any) => {
    dispatch({ type: PostedAdsActionTypes.ADS_REQUEST });
    fetch(ADS_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        ...headersWithAuthorization(),
      },
      body: JSON.stringify(formData),
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          dispatch({
            type: PostedAdsActionTypes.ADS_ERROR,
            errors: json,
          });
          return { success: false };
        }
        let imagesLength = Object.keys(images);

        let step = 0;
        if (imagesLength.length > 0) {
          imagesLength.forEach((key) => {
            dispatch(uploadImage(images[key], json.id, null));

            step = step + 1;
          });
        }

        if (step === imagesLength.length) {
          dispatch({ type: PostedAdsActionTypes.ADS_SUCCESS, payload: json });
          return { success: true };
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: PostedAdsActionTypes.ADS_ERROR,
          errors: handleError(err),
        });
      });
  };


export const updateAds =
    (id: string, formData: any, images: { [key: string]: File }, files: { [key: string]: any }) => (dispatch: any) => {

    dispatch({ type: PostedAdsActionTypes.ADS_REQUEST });
        fetch(ADS_URL + "/" + id, {
            method: "PUT",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            },
            body: JSON.stringify({...formData}),
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {
                if (!response.ok) {
                    dispatch({
                        type: PostedAdsActionTypes.ADS_ERROR,
                        errors: json,
                    });
                    return { success: false };
                }

                Object.entries(files).forEach(item => {
                    if (item[1].status === "delete") {
                        dispatch(deleteImage(item[1].id, "ads"));
                    }
                })

                let imagesLength = Object.keys(images);

                let step = 0;
                if (imagesLength.length > 0) {
                    imagesLength.forEach((key) => {
                        dispatch(uploadImage(images[key], id, null));

                        step = step + 1;
                    });
                }

                if (step === imagesLength.length) {
                    dispatch({ type: PostedAdsActionTypes.ADS_SUCCESS, payload: json });
                    return { success: true };
                }
            })
            .catch((err) => {
                dispatch({
                    type: PostedAdsActionTypes.ADS_ERROR,
                    errors: handleError(err),
                });
            });
    };


export const deleteAds = (id: string) => (dispatch: any) => {

        dispatch({ type: PostedAdsActionTypes.ADS_REQUEST });
        fetch(ADS_URL + "/" + id, {
            method: "DELETE",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {
                if (!response.ok) {
                    dispatch({
                        type: PostedAdsActionTypes.ADS_ERROR,
                        errors: json,
                    });
                    return { success: false };
                }

                dispatch({ type: PostedAdsActionTypes.ADS_SUCCESS, payload: null });
                return { success: true };

            })
            .catch((err) => {
                dispatch({
                    type: PostedAdsActionTypes.ADS_ERROR,
                    errors: handleError(err),
                });
            });
    };

const handleError = (error: any) => {
  const err = new Map([
    [TypeError, "Can't connect to server."],
    [SyntaxError, "There was a problem parsing the response."],
    [Error, error.message],
  ]).get(error.constructor);
  return err;
};
