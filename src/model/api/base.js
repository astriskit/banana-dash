import axios from "axios";

const cOProxyProd = "https://cors-anywhere.herokuapp.com/";
const cOProxyDev = "http://localhost:8080/";
const dev = true;
const cOProxy = dev ? cOProxyDev : cOProxyProd;

const baseUrl = "https://banana-stay.herokuapp.com/";

export const baseAxios = (config) => {
  config.baseURL = cOProxy + baseUrl;
  return axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      return response;
    })
    .catch(function (error) {
      //   console.log(error);
      throw error;
    });
};

export const baseGet = (what) => (id = "") => {
  const config = {
    method: "get",
    url: `${what}`,
  };
  if (id) {
    config.url += `/${id}`;
  }
  return baseAxios(config);
};
