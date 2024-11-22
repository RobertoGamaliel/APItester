import axios from "axios";
/**
 * 
 * @param {string} url endpoint to call
 * @param {Object} args arguments to send
 * @param {loader} loader if the function should show a loader when the data is loading
 * @returns 
 */
export const FetchAPI = async (url, args, headers = {}, method = "POST") => {
    if (typeof method !== 'string') method = "POST";
    method = method.toUpperCase();
    if (['POST', 'GET', 'PUT', 'DELETE', 'PATCH'].indexOf(method) === -1) method = "POST";

    headers['Content-Type'] = 'application/json; charset=utf-8';
    const api = axios.create({
        baseURL: url,
        timeout: 300000,
        headers: headers
    });

    var resp;
    try {
        switch (method) {
            case 'POST':
                resp = await api.post(url, args);
                break;
            case 'GET':
                resp = await api.get(url, args);
                break;
            case 'PUT':
                resp = await api.put(url, args);
                break;
            case 'DELETE':
                resp = await api.delete(url, args);
                break;
        }
    } catch (error) {
        return { 'error': true, 'data': parseTry(error.response.data) };
    }
    return { 'error': false, 'data': parseTry(resp.data) };
}

const parseTry = (object) => {
    try {
        let parsed = JSON.stringify(object);
        if (parsed.length > 400) return parsed.substring(0, 400) + '...';
        return parsed;
    } catch (error) {
        return "Sin objeto de respuesta";
    }
}

export default FetchAPI;