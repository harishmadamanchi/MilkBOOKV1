import { SET_META_DATA } from '../actions/authActions';


const initialState = {
    Auth : {}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_META_DATA : 
        return {
            Auth : action.Auth
        }
    }
    return state;
}