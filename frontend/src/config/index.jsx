const { default: axios } = require("axios");




export const clientServer = axios.create({
    baseURL: "http://localhost:9090",
})