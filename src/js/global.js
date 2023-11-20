import { $, get, post } from "./cocktail";

export function success(msg) {
    $('#warn').classList.replace('text-red-600', 'text-green-400')
    $('#warn').textContent = msg;
}

export function warn(msg) {
    $('#warn').textContent = msg
}

export function showMarquee(isShow) {
    isShow ? $('#marq').classList.remove('scale-0') : $('#marq').classList.add('scale-0');
}

export async function getReqFromGs(params) {
    let url = import.meta.env.VITE_THUNDERAPI;
    if (typeof params != 'object') throw new TypeError(`Params must object type`);
    if (params && typeof params == 'object') {
        for (const param in params) {
            url += `${param}=${params[param]}&`;
        }
    }
    return (await get({ url })).json()
}


export async function headers() {
    const headers = {
        Authorization: `Bearer ${await getAToken()}`,
        Accept: `application/json`,
        'Content-Type': `application/json`
    }
}

export async function getAllSheetValues(sheetName) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${sheetName}?key=${env('VITE_SHEET_AKEY')}`;
        const res = await (await get({ url, headers: await headers() }));
        const jsonRes = await res.json()
        if (res.ok) {
            const data = handleValues(jsonRes.values);
            return {
                data,
                filter:async(key,value)=>{
                    const result = [];
                    for (const val of data) { //I used for insted of filter method because of fast performance
                        if(val[key] == value){
                            result.push(val)
                        }
                    }
                    return result[0]? result : null ;
                }
            }
        } else {
            console.log(jsonRes.error.message);
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


/**
 * @Start_Handlers
 */

/**
 * Returns values with handlling as object indexes
 * @param {any[]} values 
 * @returns {object[]}
 */
function handleValues(values) {
    const head = values[0];
    const body = values.slice(1);
    const result = [];
    for (let i = 0; i < body.length; i++) {
        const obj = {};
        body[i].forEach((val, n) => {
            if (val == ' ') return;
            obj[head[n]] = val;
            obj.rowIndex = i;
        })
        result.push(obj);
    }
    return result;
}

/**
 * Returns dotenv value of key which gived
 * @param {string} key 
 * @returns 
 */
export function env(key) {
    return import.meta.env[key]
}

/**
 * Returns google access token
 * @returns {string}
 */
async function getAToken() {
    return await (await post({
        url: `https://www.googleapis.com/oauth2/v4/token`,
        data: {
            client_id: env('VITE_CLIENT_ID'),
            client_secret: env('VITE_CLIENT_SECRET'),
            refresh_token: env('VITE_REFRESH_TOKEN'),
            grant_type: `refresh_token`
        }
    })).access_token
}



console.log(await(await getAllSheetValues('Users')).filter('name','Foxw'));