import axios from 'axios';
import { useStore } from '../store/store';
 
// ========================================================================== //
// Re-usable headers you can re-use to send api requests
// ========================================================================== //

//example, with some common header types you can play around with / reasearch
export const commonHeaders = {
  // 'Content-Type': 'application/json',
  
  // 'content-type': 'application/x-www-form-urlencoded',//default
  
  Accept: 'application/json, text/plain, */*',

  'Access-Control-Allow-Origin': '*',
  
  // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',

  // 'Access-Control-Allow-Credentials': true,

  // 'Access-Control-Allow-Headers':

  //   'Content-Type, Authorization, Content-Length, X-Requested-With',

  // 'cache-control': 'no-cache',

  // 'sec-fetch-dest': 'empty',

  // 'sec-fetch-mode': 'cors',

  // 'sec-fetch-site': 'same-site',

  // pragma: 'no-cache',

  // usequerystring: 'true',
};

// ========================================================================== //
//   These are the api's they call the database, and should reflect the underlying structure
// ========================================================================== //
// -endpoints have query paramaters, they are used to filter the data **this is handled in the query params aka the params**
// -endpoints have data payloads, they are used to create new data, **this is handled in the body**
// -endpoints can handle many or one payload/query, this is handled in the header
// -queries and data payloads, are structured in a javascript object {key:value,key:{subObject:value}} but
// -you should understand special key values used in mongodb, and the correct format for using these
//    -javascript objects before making ANY api calls, so as, to not mess up data in the database
//    -for this reason, we have a test database, and a production database, and this is configured in the environment variables
// -dont be overwhelmed, once you see one section, you see the rest are the same, just they handle
//    -different data models, and different payloads
// ========================================================================== // 
  
// const serverURL = `http://localhost:${process.env.SERVER_PORT}/${process.env.API_URL}`; 
const serverURL =  `http://localhost:3001/.netlify/functions/server`; 
 
import getConfig from 'next/config';
import { userService } from 'services';
const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };
    return axios.request({method: '', url, proxy:false, headers:{...commonHeaders}, body: {}, ...requestOptions}).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return axios.request({method: '', url, proxy:false, headers:{...commonHeaders}, body: {}, ...requestOptions}).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return axios.request({method: '', url, proxy:false, headers:{...commonHeaders}, body: {}, ...requestOptions}).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return axios.request({method: '', url, proxy:false, headers:{...commonHeaders}, body: {}, ...requestOptions}).then(handleResponse);
}

// ========================================================================== //
// Authorization and Account
// ========================================================================== // 
function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}