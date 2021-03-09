import { ADD_MILK_COLLECTION } from '../actions/MilkCollection';

const initialState = {
    MilkCollection : {}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_MILK_COLLECTION :

            return {
                ...state,
                MilkCollection : {...state.MilkCollection, [action.SupplierId] : action.SupplierDailyMILK}
                // MilkCollection : state.MilkCollection.concat(action.SupplierDailyMILK)
            };
    }
    return state;
}