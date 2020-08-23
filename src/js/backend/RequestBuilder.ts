import config from '../config/config';

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache': 'no-cache'
};

const convertBody = (body) => {
    if (!body)
        return null;
    if (body instanceof FormData)
        return body;
    return JSON.stringify(body)
}

export class RequestBuilder {

    private constructor() {

    }

    public static GET(path: string, body = null, headers: HeadersInit = defaultHeaders) {
        return this.REQUEST(path, HttpMethod.GET, body, headers);
    }

    public static POST(path: string, body = null, headers: HeadersInit = defaultHeaders) {
        return this.REQUEST(path, HttpMethod.POST, body, headers);
    }

    public static PUT(path: string, body = null, headers: HeadersInit = defaultHeaders) {
        return this.REQUEST(path, HttpMethod.PUT, body, headers);
    }

    public static DELETE(path: string, body = null, headers: HeadersInit = defaultHeaders) {
        return this.REQUEST(path, HttpMethod.DELETE, body, headers);
    }

    public static REQUEST(path: string, method: HttpMethod = HttpMethod.GET, body = null, headers: HeadersInit = defaultHeaders): Request {
        let endpoint = config.backend.endpoint;
        if (!endpoint.endsWith('/')) {
            endpoint += '/';
        }

        const payload: RequestInit = {
            method: method.toString(),
            mode: 'cors',
            credentials: 'include',
            headers: headers,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: convertBody(body)
        };

        const endpoint_url = new URL(endpoint);
        const url = new URL(path, endpoint_url);
        console.log('endpoint: %s, path: %s, url: %s', endpoint, path, url.toString());
        const req = new Request(url.toString(), payload)
        console.log(req)
        return req;
    }

}
