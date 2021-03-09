import SUPPLIERS from '../../data/dummy-data';
import { ADD_SUPPLIER, SET_SUPPLIERS, ADD_CUSTOMER, SET_CUSTOMERS } from '../actions/Suppliers';


const initialState = {
    Suppliers : SUPPLIERS,
    Customers : []
}


export default (state = initialState , action) => {
    switch(action.type) {
        case SET_SUPPLIERS :
            return {
                Suppliers : action.loadedSuppliers
            }
        case ADD_SUPPLIER : 
            return {
                ...state,
                Suppliers : state.Suppliers.concat(action.supplier)
            };
        case ADD_CUSTOMER : 
            return {
                ...state,
                Customers : state.Customers.concat(action.Customer)
            }
        case SET_CUSTOMERS : 
            return {
                ...state,
                Customers : action.loadedCustomers
            }

    }
    return state;
}
