import { validator } from './';

export enum REQUEST_TYPE {
    NORMAL = 'NORMAL',
    OAUTH = 'OAUTH',
    BASIC_TOKEN = 'BASIC_TOKEN',
    UPLOAD = 'UPLOAD',
    TICKET = 'TICKET',
    URL_ENCODED = 'URL_ENCODED',
    SSO = 'SSO',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}

export enum METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export type ApiConfig = {
    timeout?: number;
    requestType?: REQUEST_TYPE;
    basicToken?: string;
};

const DEFAULT_TIMEOUT = 30000;

export const apiBase = async (
    url: string,
    method: METHOD,
    data: any,
    config: ApiConfig = { requestType: REQUEST_TYPE.NORMAL, timeout: DEFAULT_TIMEOUT }
) => {
    const { requestType, timeout = DEFAULT_TIMEOUT } = config;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const headers: any = {
        'Content-Type': 'application/json',
    };

    // Note: In a real app, you'd add Authorization headers here based on requestType
    
    let fetchUrl = url;
    const options: RequestInit = {
        method,
        headers,
        signal: controller.signal,
    };

    if (data) {
        if (method === METHOD.GET) {
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => params.append(key, data[key]));
            fetchUrl = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
        } else {
            options.body = JSON.stringify(data);
        }
    }

    try {
        console.log(`[API Request] ${method} ${fetchUrl}`, data || '');
        const response = await fetch(fetchUrl, options);
        clearTimeout(id);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`[API Response] ${method} ${fetchUrl}`, result);
        return result;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            console.error(`[API Timeout] ${method} ${fetchUrl}`);
            throw new Error('Request timeout');
        }
        console.error(`[API Error] ${method} ${fetchUrl}`, error);
        throw error;
    }
};
