const { default: axios } = require("axios");




export const clientServer = axios.create({
    baseURL: "http://localhost:9090",
})

// Image URL base
export const BASE_URL = "http://localhost:9090/uploads";