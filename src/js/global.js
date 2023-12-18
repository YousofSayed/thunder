import { $, GET, POST, PUT, parse, stringify } from "./cocktail";

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


export async function headers() {
    const headers = {
        Authorization: `Bearer ${await getAToken()}`,
        Accept: `application/json`,
        'Content-Type': `application/json`
    }
    return headers
}
// 1u66NoFwvKj4aV3hUbv44qB8R_Mnie5r5042ozCEoBLk
export async function getAllSheetValues(range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}?key=${import.meta.env.VITE_SHEET_AKEY}`;
        const res = await (await GET({ url, headers: await headers() }));
        const jsonRes = await res.json()
        if (res.status == 200) {
            return {
                filter: async (value) => {
                    const result = [];
                    const keyWords = new RegExp(value?.toLowerCase().match(/\w+|[\u0600-\u06FF\u0750-\u077F]+/ig)?.join('|'));
                    for (let [i, val] of jsonRes.values.entries()) { //I used for insted of filter method because of fast performance
                        if (!val[0]) continue;
                        if (keyWords.test(val[0].toLowerCase())) {
                            val = parse(val);
                            val.schema.index = i+1
                            result.push(val)
                        }
                    }
                    return result.length ? result : null;
                }
            }
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function getFromTo(sheetName, from, to) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${sheetName}!A${from}:Z${to}?key=${import.meta.env.VITE_SHEET_AKEY}`;
        const res = await (await GET({ url, headers: await headers() }));
        const jsonRes = await res.json()
        const data = jsonRes.values || [];
        if (res.status == 200) {
            const rangedData = data.map((item) => {
                if (!item[0]) { from++; return };
                item = parse(item);
                item.schema.index = from;
                from++
                return item;
            }).filter(item => item != undefined);
            return rangedData;
        }
        return data;
    } catch (error) {
        throw new Error(error.message)
    }
}


export async function append(range, values) {
    const res = await POST({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}:append?valueInputOption=RAW&key=${import.meta.env.VITE_SHEET_AKEY}`,
        headers: await headers(),
        data: {
            values: [[stringify(values)]]
        },
        json: true,
    })

    return res;
}

export async function update(range, values) {
    try {
        const res = await PUT({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}?valueInputOption=RAW&key=${import.meta.env.VITE_SHEET_AKEY}`,
            headers: await headers(),
            data: {
                values: [[stringify(values)]]
            }
        });

        // console.log(res);
        return res;
    } catch (error) {
        update(range, value);
        throw new Error(error.message);
    }
}

export async function clear(range) {

    try {
        const res = await POST({
            url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}:clear?alt=json&key=${import.meta.env.VITE_SHEET_AKEY}`,
            headers: await headers(),
        })

        console.log(res);
        return res
    } catch (error) {
        clear(range);
        throw new Error(error.message);
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
    return await (await POST({
        url: `https://www.googleapis.com/oauth2/v4/token`,
        data: {
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            refresh_token: import.meta.env.VITE_REFRESH_TOKEN,
            grant_type: `refresh_token`
        }
    })).access_token
}
