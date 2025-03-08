const host = "http://localhost:4000";
export const setAvatarAPI = `${host}/api/auth/setAvatar`;
export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;
export const addTransaction = `${host}/api/v1/addTransaction`;
export const getTransactions = `${host}/api/v1/getTransaction`;
export const editTransactions = `${host}/api/v1/updateTransaction`;
export const deleteTransactions = `${host}/api/v1/deleteTransaction`;

export const getAllTransactions = `${host}/api/v1/getAllTransactions`;
export const deleteMultipleTransactions = `${host}/api/v1/deleteMultipleTransactions` ;
export const getTransactionById = `${host}/api/v1/getTransactionById` ;