import config from '../config/config';

export const POST = 'POST';
export const PUT = 'PUT';
export const GET = 'GET';
export const DELETE = 'DELETE';

/**
 * This class is responsible for accessing a RESTful API.
 */
export class RestApi {

    /**
     * Create a new RestApi to a given host.
     *
     * @param host The URL to the host's endpoint.
     */
    constructor(host) {
        this._endpoint = host;
        if (!this._endpoint.endsWith('/')) {
            this._endpoint += '/';
        }
    }

    /**
     * Accesses the REST API using HTTP-GET.
     *
     * @param path The path relative to the specified endpoint.
     * @param getParams URL param array like ['paramname1=paramvalue1', 'paramname2=paramvalue2', ...]
     * @param headers
     * @returns {*} a Promise
     */
    httpGet(path, getParams = null, headers = RestApi._headers()) {
        if (!getParams)
            return this._httpRequest(path, GET, null);
        return this._httpRequest(`${path}?${getParams.join('&')}`, GET, null, headers);
    }

    /**
     * Accesses the REST API using HTTP-POST.
     *
     * @param path The path relative to the given endpoint.
     * @param body The JSON body to be sent.
     * @param headers Custom headers.
     * @returns {*} a Promise
     */
    httpPost(path, body, headers = RestApi._headers()) {
        return this._httpRequest(path, POST, body, headers);
    }

    /**
     * Accesses the REST API using HTTP-PUT.
     *
     * @param path The path relative to the given endpoint.
     * @param body The JSON body to be sent.
     * @param headers Custom headers.
     * @returns {*} a Promise
     */
    httpPut(path, body, headers = RestApi._headers()) {
        return this._httpRequest(path, PUT, body, headers);
    }

    /**
     * Accesses the REST API using HTTP-DELETE.
     *
     * @param path The path relative to the given endpoint.
     * @param body The JSON body to be sent.
     * @param headers Custom headers.
     * @returns {*} a Promise
     */
    httpDelete(path, body, headers = RestApi._headers()) {
        return this._httpRequest(path, DELETE, body, headers);
    }

    /**
     * Creates the HTTP-Request.
     *
     * @param path The path relative to specified endpoint.
     * @param method The HTTP-method to be used.
     * @param params The JSON body to be sent.
     * @param headers Additional headers.
     * @returns {Promise<Response | never>}
     * @private
     */
    _httpRequest(path, method, params, headers = RestApi._headers()) {
        let url = this._buildUrl(path);
        console.log("Requesting", url);

        let body = (params) ? params : null;
        if (typeof body === 'object' && !(body instanceof FormData) && body !== null) {
            body = JSON.stringify(body)
        }

        let payload = {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: body
        };

        return fetch(url, payload)
            .then((response) => {
                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json();
                    }
                    return response.text();
                }
                throw new Error("RestApi - [" + method + "] - " + url + " answers -> Response was NOT OK! Getting status: " + response.status + "\nwith content: " + response.text());
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            });
    }

    /**
     * Builds URL using the specified endpoint path.
     *
     * @param path The path relative to the specified endpoint.
     * @returns {string}
     * @private
     */
    _buildUrl(path) {
        if (path.startsWith('/')) {
            path = path.substring(1)
        }
        return `${this._endpoint}${path}`;
    }

    /**
     * @returns The header for the HTTP-Request.
     */
    static _headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        };
    }
}

const client = new RestApi(config.backend.endpoint);

export default client;
