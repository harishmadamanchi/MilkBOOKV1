export const SET_META_DATA = 'SET_META_DATA';


export const setLoginData = (auth) => {
    return { type : SET_META_DATA, Auth : auth}
}