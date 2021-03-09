import Supplier from '../../models/supplier';

export const ADD_SUPPLIER = 'ADD_SUPPLIER';
export const SET_SUPPLIERS = 'SET_SUPPLIERS';
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const SET_CUSTOMERS = 'SET_CUSTOMERS';

export const fetchSuppliers = () => {
    return async dispatch => {
        const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/Supplier.json');
        const resData = await response.json();
        const loadedSuppliers = [];
            for(const key in resData){
                loadedSuppliers.push(new Supplier(key,resData[key].SupplierName,
                    resData[key].SupplierImage,resData[key].SupplierMobile,
                    resData[key].SupplierAddress));
            }
        dispatch({
            type : SET_SUPPLIERS,
            loadedSuppliers : loadedSuppliers
        });
    }
}

export const AddCustomer = customer => {
    return { type : ADD_CUSTOMER, Customer : customer}
}

export const addSupplier = supplier => {
    return async dispatch =>{
       dispatch ({ type : ADD_SUPPLIER, supplier : supplier});
    }
}

export const fetchCustomers = () => {
    return async dispatch => {
        const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/Customers.json');
        const resData = await response.json();
        const loadedCustomers = [];
            for(const key in resData){
                loadedCustomers.push(new Supplier(key,resData[key].CustomerName,
                    resData[key].CustomerImage,resData[key].CustomerMobile,
                    resData[key].CustomerAddress));
            }
        dispatch({
            type : SET_CUSTOMERS,
            loadedCustomers : loadedCustomers
        });
    }
}