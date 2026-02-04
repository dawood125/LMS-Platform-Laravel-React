export const apiUrl = import.meta.env.VITE_API_URL;
const userInfo=localStorage.getItem("userInfolms")?JSON.parse(localStorage.getItem("userInfolms")):null;
export const authToken=userInfo?userInfo.token:null;