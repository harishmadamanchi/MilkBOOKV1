export const ADD_MILK_COLLECTION = 'ADD_MILK_COLLECTION';
export const SET_MILK_COLLECTION = 'SET_MILK_COLLECTION';


// export const fetchDailyMilkCollection = (supplierId, dateSelected) => {
//     return async dispatch => {
//         const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/MilkCollection/'+supplierId+'/'+dateSelected+'.json');
//         const resData = await response.json();
//     }
// }

export const addMilkCollection = (SupplierDailyMILK, SupplierId) => {
    return { type: ADD_MILK_COLLECTION, SupplierDailyMILK : SupplierDailyMILK, SupplierId : SupplierId}
}