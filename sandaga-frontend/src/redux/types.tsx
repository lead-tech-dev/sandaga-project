import rootStore from "./rootStore";
// User login and register
export const SUCCESS = 'SUCCESS';

export const LOADING = 'LOADING';

export const SET_ROLE = 'SET_ROLE';



export type State = ReturnType<typeof rootStore>;