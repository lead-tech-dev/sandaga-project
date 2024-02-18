import {
  headersImageAuthorization,
  IMAGE_URL,
} from "../../hooks/useConfig";
import { ImageActionTypes } from "../types/ads.type";
import {getAuthUserData} from "./auth.actions";
import {AuthActionTypes} from "../types/auth.type";

export const uploadImage = (file: File, adsId: string | null, userId: string | null) => (dispatch: any) => {
  let formData = new FormData();

  formData.append("file", file);
  adsId && formData.append("adsId", adsId);
  userId && formData.append("userId", userId);

  dispatch({ type: ImageActionTypes.IMAGE_REQUEST });
  fetch(IMAGE_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      ...headersImageAuthorization(),
    },
    body: formData,
  })
    .then((response) => Promise.all([response, response.json()]))
    .then(([response, json]) => {

      if (!response.ok) {
        dispatch({
          type: ImageActionTypes.IMAGE_ERROR,
          errors: json,
        });
        return { success: false, errors: json };
      }
      dispatch({
        type: ImageActionTypes.IMAGE_SUCCESS
      });

      if (userId) {
          dispatch({
              type: AuthActionTypes.ADD_USER_IMAGE,
              payload: json
          });
      }
      //dispatch(getAuthUserData());
      return { success: true, payload: json };
    })
    .catch((err) => {
      dispatch({
        type: ImageActionTypes.IMAGE_ERROR,
        errors: handleError(err),
      });
    });
};
export const updateImage = (file: File,id: string) => (dispatch: any) => {
  let formData = new FormData();

  formData.append("file", file);
  formData.append("imageId", id);

  dispatch({ type: ImageActionTypes.IMAGE_REQUEST });
  fetch(IMAGE_URL, {
    method: "PUT",
    mode: "cors",
    headers: {
      ...headersImageAuthorization(),
    },
    body: formData,
  })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          dispatch({
            type: ImageActionTypes.IMAGE_ERROR,
            errors: json,
          });
          return { success: false, errors: json };
        }

        dispatch({
          type: ImageActionTypes.IMAGE_SUCCESS
        });
        dispatch({
            type: AuthActionTypes.UPDATE_USER_IMAGE,
            payload: json,
        });

        //dispatch(getAuthUserData());
        return { success: true, payload: json };
      })
      .catch((err) => {
        dispatch({
          type: ImageActionTypes.IMAGE_ERROR,
          errors: handleError(err),
        });
      });
};


export const deleteImage = (id: string, type: string) => (dispatch: any) => {

  dispatch({ type: ImageActionTypes.IMAGE_REQUEST });
  fetch(IMAGE_URL + "/" + id, {
    method: "DELETE",
    mode: "cors",
    headers: {
      ...headersImageAuthorization(),
    }
  })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          dispatch({
            type: ImageActionTypes.IMAGE_ERROR,
            errors: json,
          });
          return { success: false, errors: json };
        }

        dispatch({
          type: ImageActionTypes.IMAGE_SUCCESS
        });

        if (type === "user") {
            dispatch({
                type: AuthActionTypes.DELETE_USER_IMAGE
            });
        }
       // dispatch(getAuthUserData());
        return { success: true, payload: json };
      })
      .catch((err) => {
        dispatch({
          type: ImageActionTypes.IMAGE_ERROR,
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
