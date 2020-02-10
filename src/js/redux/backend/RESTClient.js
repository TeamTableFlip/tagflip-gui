export const POST = 'POST';
export const GET = 'GET';
export const DELETE = 'DELETE';

/**
 * This class is responsible for accessing a RESTful API.
 */
export default class RESTClient {

    /**
     * Create a new RESTClient to a given host.
     *
     * @param host The URL to the host's endpoint.
     */
    constructor(host) {
        this._endpoint = host;
        if(!this._endpoint.endsWith('/')) {
            this._endpoint += '/';
        }
    }

    /**
     * Accesses the REST API using HTTP-GET.
     *
     * @param path The path relative to the specified endpoint.
     * @param urlParams URL param array like ['paramname1=paramvalue1', 'paramname2=paramvalue2', ...]
     * @returns {*} a Promise
     */
    httpGet(path, urlParams) {
        if (!urlParams)
            return this._httpRequest(path, GET, null);
        return this._httpRequest(`${path}?${urlParams.join('&')}`, GET, null);
    }

    /**
     * Accesses the REST API using HTTP-POST.
     *
     * @param path The path relative to the given endpoint.
     * @param body The JSON body to be sent.
     * @returns {*} a Promise
     */
    httpPost(path, body) {
        return this._httpRequest(path, POST, body);
    }

    /**
     * Accesses the REST API using HTTP-DELETE.
     *
     * @param path The path relative to the given endpoint.
     * @param body The JSON body to be sent.
     * @returns {*} a Promise
     */
    httpDelete(path, body) {
        return this._httpRequest(path, DELETE, body);
    }

    /**
     * Creates the HTTP-Request.
     *
     * @param path The path relative to specified endpoint.
     * @param method The HTTP-method to be used.
     * @param params The JSON body to be sent.
     * @returns {Promise<Response | never>}
     * @private
     */
    _httpRequest(path, method, params) {
        let url = this._buildUrl(path);
        let body = (params) ? {body: JSON.stringify(params)} : null;

        let payload = Object.assign({
                method: method,
                mode: 'cors',
                credentials: 'include'
            },
            {
                headers: RESTClient._headers()
            },
            body);

        return fetch(url, payload)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("RESTClient - [" + method + "] - " + url + " answers -> Response was NOT OK! Getting status: " + response.status + "\nwith content: " + response.text());
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