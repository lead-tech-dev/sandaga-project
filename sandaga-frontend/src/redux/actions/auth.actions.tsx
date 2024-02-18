import {
    LOGIN_URL,
    SIGNUP_URL,
    defaultHeaders,
    ACTIVE_USER_URL,
    FORGOT_PASSWORD_USER_URL,
    RESET_PASSWORD_USER_URL,
    storeAccessToken,
    getRefreshToken,
    headersWithAuthorization, CONTACT_URL,
} from "../../hooks/useConfig";
import { AuthActionTypes } from "../types/auth.type";
import { GlobalsActionTypes } from "../types/globals.type";
import { FormDataInterface } from "../../interfaces/form.interface";
/*
interface SignInSuccessAction {
  type: typeof AuthActionTypes.SIGN_IN_SUCCESS;
}

interface SignInFailureAction {
  type: typeof AuthActionTypes.SING_IN_FAILURE;
  errors: any;
}

export type AuthActions = SignInSuccessAction | SignInFailureAction;*/
export const loginUser = (credentials: any) => (dispatch: any) => {
  dispatch({ type: GlobalsActionTypes.LOADING });
  fetch(LOGIN_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      ...defaultHeaders(),
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => Promise.all([response, response.json()]))
    .then(([response, json]) => {
      if (!response.ok) {
        return dispatch({
          type: AuthActionTypes.SING_IN_FAILURE,
          errors: json,
        });
      }

      dispatch({ type: AuthActionTypes.SIGN_IN_SUCCESS });
      dispatch({ type: AuthActionTypes.SET_ROLE, payload: json.role });
      setAuthorizationHeader(json);
      //dispatch(getAuthUserData());
      //const from = location.state ?  location.state.from.pathname : "/";
     // navigate(from, { replace: true });
    })
    .catch((err) => {

      dispatch({
        type: AuthActionTypes.SING_IN_FAILURE,
        errors: handleError(err),
      });
    });
};

export const signupUser = (data: any) => (dispatch: any) => {
  dispatch({ type: GlobalsActionTypes.LOADING });

  return fetch(SIGNUP_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      ...defaultHeaders(),
    },
    body: JSON.stringify(data),
  })
    .then((response) => Promise.all([response, response.json()]))
    .then(([response, json]) => {
      if (!response.ok) {
        return dispatch({
          type: AuthActionTypes.SING_IN_FAILURE,
          errors: json,
        });
      }

      dispatch({ type: GlobalsActionTypes.SUCCESS });
    })
    .catch((err) => {
      dispatch({
        type: AuthActionTypes.SING_IN_FAILURE,
        errors: handleError(err),
      });
    });
};

export const getAuthUserData = () => (dispatch: any) => {
      dispatch({ type: AuthActionTypes.SIGN_IN_REQUEST });
      fetch(SIGNUP_URL + "/me", {
        method: "GET",
        mode: "cors",
        headers: {
          ...headersWithAuthorization(),
        }
      })
          .then((response) => Promise.all([response, response.json()]))
          .then(([response, json]) => {
            if (!response.ok) {
              return dispatch({
                type: AuthActionTypes.SING_IN_FAILURE,
                errors: json,
              });
            }
            dispatch(setUserData(json));
          })
          .catch((err) => {
            dispatch({
              type: AuthActionTypes.SING_IN_FAILURE,
              errors: handleError(err),
            });
          });
    };

export const getUserFollow = (data: {userFollowerId: string; name: string, status: boolean}) => (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.FOLLOW_LOADING });
    fetch(SIGNUP_URL + "/connect", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify({userFollowerId: data.userFollowerId})
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.FOLLOW_FAILURE,
                    errors: json,
                });
            }
            if (data.status) {
                dispatch({
                    type: AuthActionTypes.REMOVE_USER_FOLLOWING,
                    id: data.userFollowerId
                })
            }else {
                dispatch({
                    type: AuthActionTypes.ADD_USER_FOLLOWING,
                    payload: {id: data.userFollowerId, name: data.name}
                })
            }
            //dispatch(getAuthUserData());
        })
        .catch((err) => {
            dispatch({
                type: AuthActionTypes.FOLLOW_FAILURE,
                errors: handleError(err),
            });
        });
};

export const refreshExpiredToken = () => async (dispatch: any) => {
  return fetch(LOGIN_URL + "/refresh", {
    method: "POST",
    mode: "cors",
    headers: {
      ...defaultHeaders(),
    },
    body: JSON.stringify({ refreshToken: getRefreshToken() }),
  })
    .then((response) => Promise.all([response, response.json()]))
    .then(([response, json]) => {
      if (!response.ok) {
        dispatch({
          type: AuthActionTypes.SING_IN_FAILURE,
          errors: json,
        });
        return { success: false };
      }
      dispatch({ type: AuthActionTypes.SIGN_IN_SUCCESS });
      setAuthorizationHeader(json);
      dispatch(getAuthUserData());
      return { success: true };
    })
    .catch((e) => {
      dispatch({ type: AuthActionTypes.SING_IN_FAILURE, errors: e });
    });
};

export const activeUser = (token: string) => async () => {
  return fetch(ACTIVE_USER_URL + "/" + token, {
    method: "GET",
    mode: "cors",
    headers: {
      ...defaultHeaders(),
    },
  })
    .then((response) => Promise.all([response, response.json()]))
    .then(([response, json]) => {
      if (!response.ok) {
        return { success: false, error: json };
      }
      return { success: true };
    })
    .catch((e) => {
      return handleError(e);
    });
};

export const forgotPasswordUser =
  (data: FormDataInterface) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.LOADING });
    return fetch(FORGOT_PASSWORD_USER_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        ...defaultHeaders(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          return dispatch({
            type: AuthActionTypes.SING_IN_FAILURE,
            errors: json,
          });
        }
        dispatch({ type: GlobalsActionTypes.SUCCESS });
      })
      .catch((e) => {
        dispatch({ type: AuthActionTypes.SING_IN_FAILURE, errors: e });
      });
  };

export const resetPasswordUser =
  (data: FormDataInterface) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.LOADING });
    return fetch(RESET_PASSWORD_USER_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        ...defaultHeaders(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (!response.ok) {
          return dispatch({
            type: AuthActionTypes.SING_IN_FAILURE,
            errors: json,
          });
        }
        dispatch({ type: GlobalsActionTypes.SUCCESS });
      })
      .catch((e) => {
        dispatch({ type: AuthActionTypes.SING_IN_FAILURE, errors: e });
      });
  };

export const sendUserModifyEmail = () => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_LOADING });
    return fetch(SIGNUP_URL + "/email/send", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }
            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS });
        })
        .catch((e) => {
           dispatch({ type: AuthActionTypes.UPDATE_FAILURE  , errors: e });
        });
};

export const updateUserEmail = (data: {email: string, code: string}) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_LOADING });
    return fetch(SIGNUP_URL + "/email/update", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }

            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS});
            dispatch({ type: AuthActionTypes.SET_ROLE, payload: json.role });
            setAuthorizationHeader(json);
            dispatch(getAuthUserData());

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.UPDATE_FAILURE, errors: e });
        });
};

export const addUserAddress = (data: {number: string, pincode: string, street: string, city: string; state: string; country: string}) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_EMAIL_LOADING });
    return fetch(SIGNUP_URL + "/address/add", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }

            //dispatch(getAuthUserData())
            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS});
            dispatch({ type: AuthActionTypes.ADD_USER_ADDRESS, payload: json});

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.UPDATE_FAILURE, errors: e });
        });
};

export const updateUserAddress = (data: {id: string, number: string, pincode: string, street: string, city: string; state: string; country: string}) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_LOADING });
    return fetch(SIGNUP_URL + "/address/update", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }
            //dispatch(getAuthUserData())
            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS});
            dispatch({ type: AuthActionTypes.UPDATE_USER_ADDRESS, payload: json});

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.UPDATE_FAILURE, errors: e });
        });
};

export const updateUserInfo= (data: {[key: string]: string}) => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_LOADING });

    return fetch(SIGNUP_URL + "/info/update", {
        method: "POST",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }

            //dispatch(getAuthUserData())
            dispatch({ type: AuthActionTypes.UPDATE_USER_INFO, payload: json});
            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS});

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.UPDATE_FAILURE, errors: e });
        });
};

export const deleteUser = () => async (dispatch: any) => {
    dispatch({ type: GlobalsActionTypes.UPDATE_LOADING });

    return fetch(SIGNUP_URL, {
        method: "DELETE",
        mode: "cors",
        headers: {
            ...headersWithAuthorization(),
        }
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.UPDATE_FAILURE,
                    errors: json,
                });
            }

            clearAuthorizationHeader();
            dispatch({ type: GlobalsActionTypes.UPDATE_SUCCESS});

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.UPDATE_FAILURE, errors: e });
        });
};

export const contact = (data: {firstname: string, lastname: string; raison: string, email: string, message: string}) => async (dispatch: any) => {
    dispatch({ type: AuthActionTypes.CONTACT_LOADING });

    return fetch(CONTACT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            ...defaultHeaders(),
        },
        body: JSON.stringify(data)
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            if (!response.ok) {
                return dispatch({
                    type: AuthActionTypes.CONTACT_FAILURE,
                    errors: json,
                });
            }
            dispatch({ type: AuthActionTypes.CONTACT_SUCCESS});

        })
        .catch((e) => {
            dispatch({ type: AuthActionTypes.CONTACT_FAILURE, errors: e });
        });
};


export const logoutUser = (refreshToken: any) => (dispatch: any) => {
  return fetch(LOGIN_URL, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(refreshToken),
  })
    .then((response) => {
      dispatch({
        type: AuthActionTypes.LOGOUT_SUCCESS,
      });
      handleResponseError(response);
      clearAuthorizationHeader();
    })
    .catch((e: any) => {
      dispatch({
        type: AuthActionTypes.LOGOUT_FAILURE,
        error: handleError(e),
      });
    });
};

export const setUserData = (data: any) => ({
  type: AuthActionTypes.SING_IN_DATA,
  payload: data,
});

const handleError = (error: any) => {
  const err = new Map([
    [TypeError, "Can't connect to server."],
    [SyntaxError, "There was a problem parsing the response."],
    [Error, error.message],
  ]).get(error.constructor);
  return err;
};

const handleResponseError = (response: any) => {
  if (!response.ok) {
    const error = response.json();
    console.log(error);
    throw Error(error);
  }
  return response;
};

const setAuthorizationHeader = (token: any) => {
  storeAccessToken(token);
};

const clearAuthorizationHeader = () => {
  storeAccessToken("");
};
