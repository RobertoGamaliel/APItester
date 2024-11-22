import axios from "axios";
/**
 * 
 * @param {string} url endpoint to call
 * @param {Object} args arguments to send
 * @param {loader} loader if the function should show a loader when the data is loading
 * @returns 
 */
export const FetchAPI = async (url, args = {}, headers = {}, method = "POST") => {
    if (typeof method !== 'string') method = "POST";
    method = method.toUpperCase();
    if (!['POST', 'GET', 'PUT', 'DELETE', 'PATCH'].includes(method)) method = "POST";
    console.log(`url`, url, method);
    //headers['Content-Type'] = 'application/json; charset=utf-8';
    const api = axios.create({
        baseURL: url,
        headers: headers
    });

    var resp;
    try {
        switch (method) {
            case 'POST':
                resp = await api.post(url, args).catch((error) => { return error.response });
                break;
            case 'GET':
                resp = await api.get(url, args).catch((error) => { return error.response });
                break;
            case 'PUT':
                resp = await api.put(url, args).catch((error) => { return error.response });
                break;
            case 'PATCH':
                resp = await api.patch(url, args).catch((error) => { return error.response });
                break;
            case 'DELETE':
                resp = await api.delete(url, args).catch((error) => { return error.response });
                break;
        }


    } catch (error) {
        return { 'error': true, 'data': parseTry(error?.response?.data) };
    }
    if (!resp) return { 'error': true, 'data': 'Sin respuesta del servidor' };

    if (resp.status !== 200) {
        return { 'error': true, 'data': "Status " + resp.status + ", " + resp.statusText };
    }

    return { 'error': false, 'data': parseTry(resp?.data) };
}

const parseTry = (object) => {
    try {
        let parsed = JSON.stringify(object, null, 2);
        if (parsed.length > 600) return parsed.substring(0, 600) + '...';
        return parsed;
    } catch (error) {
        return "Sin objeto de respuesta";
    }
}

export default FetchAPI;