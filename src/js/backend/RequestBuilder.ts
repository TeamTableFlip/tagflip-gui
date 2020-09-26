import config from '../config/config';

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache': 'no-cache'
};

const convertBody = (body) => {
    if (!body)
        return null;
    if (body instanceof FormData)
        return body;
    if (body instanceof URLSearchParams)
        return body;
    return JSON.stringify(body)
}

export interface QueryParam {
    key: string,
    value: any

}

export class SimpleQueryParam implements QueryParam {
    key: string;
    value: any;

    constructor(key: string, value: any) {
        this.key = key;
        this.value = value;
    }

    public static of(key: string, value: any) {
        return new SimpleQueryParam(key, value)
    }
}

export class OffsetLimitParam {
    key: string = "offset";
    value: any;

    public static of(offset: number, limit: number): QueryParam[] {
        return [SimpleQueryParam.of("offset", offset), SimpleQueryParam.of("limit", limit)]
    }

}

export class RequestBuilder {

    private constructor() {

    }

    public static GET(path: string, queryParams: QueryParam[] = [], headers: HeadersInit = defaultHeaders) {
        return this.REQUEST(path, HttpMethod.GET, null, headers, ...queryParams);
    }

    public static POST(path: string, body = null, headers: HeadersInit = defaultHeaders, ...queryParams: QueryParam[]) {
        return this.REQUEST(path, HttpMethod.POST, body, headers, ...queryParams);
    }

    public static PUT(path: string, body = null, headers: HeadersInit = defaultHeaders, ...queryParams: QueryParam[]) {
        return this.REQUEST(path, HttpMethod.PUT, body, headers, ...queryParams);
    }

    public static DELETE(path: string, body = null, headers: HeadersInit = defaultHeaders, ...queryParams: QueryParam[]) {
        return this.REQUEST(path, HttpMethod.DELETE, body, headers, ...queryParams);
    }

    public static POST_URL_ENCODED_FORM(path: string, body: QueryParam[] = [], ...queryParams: QueryParam[]) {
        let data = new URLSearchParams();
        if (body) {
            for (const param of body) {
                data.append(param.key, param.value)
            }
        }

        return this.REQUEST(path, HttpMethod.POST, data, {}, ...queryParams);
    }


    public static REQUEST(path: string, method: HttpMethod = HttpMethod.GET, body = null, headers: HeadersInit = defaultHeaders, ...queryParams: QueryParam[]): Request {
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

        const url = new URL(path, endpoint);
        console.log("endpoint=%o", endpoint)
        console.log("url=%o", url)
        if (queryParams) {
            for (const queryParam of queryParams) {
                url.searchParams.append(queryParam.key, queryParam.value)
            }
        }

        const req = new Request(url.toString(), payload)
        console.log(req)
        return req;
    }

}
