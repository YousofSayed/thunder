import { $, GET, POST, PUT, parse, repeatAsArray, stringify } from "./cocktail";

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
                data: jsonRes,
                async filter(value) {
                    const result = [];
                    const keyWords = new RegExp(value?.toLowerCase().match(/\w+|[\u0600-\u06FF\u0750-\u077F]+/ig)?.join('|'));
                    for (let [i, val] of jsonRes.values.entries()) { //I used for insted of filter method because of fast performance
                        if (!val[0]) continue;
                        if (keyWords.test(val[0].toLowerCase())) {
                            val = parse(val);
                            val.schema.index = i + 1
                            result.push(val)
                        }
                    }
                    return result.length ? result : null;
                },
                async replaceAllAndUpdate(value, newValue) {
                    const data = jsonRes.values;
                    const ranges = [];
                    const newVal = [];
                    data.forEach((val, i) => {
                        // console.log(val);
                        if (val[0] && val[0].includes(value)) {
                            const newVal = val[0].replace(value, newValue);
                            console.log(newVal);
                            ranges.push(`${range}!A${i}:Z${999}`);
                            newVal.push(``)
                        };

                    })
                    // const newData = data.replaceAll(value, newValue);
                    const res = await PUT({
                        url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/batchUpdate?valueInputOption=RAW&key=${import.meta.env.VITE_SHEET_AKEY}`,
                        headers: await headers(),
                        data: ranges
                    });
                    const jsonRes2 = res.json()
                    console.log(ranges , await jsonRes2);
                    return await (await jsonRes2).updatedRange ? 'Successfully updates' : 'Failed to update';
                },
                async replaceItemWithItem(uniqueKey, newItem) {
                    const data = jsonRes.values;
                    const dataWillBeRender = [];
                    data.forEach(val => {
                        if (!val[0]) return;
                        const isIt = stringify(val).includes(uniqueKey);
                        val[0] = parse(val[0])
                        if (isIt && val[0].type == 'post') {
                            val[0].schema = newItem
                        }
                        else if (val[0].type == 'repost' && isIt) {
                            val[0].schema.post = newItem;
                        }
                        dataWillBeRender.push(val[0]);
                        val[0] = stringify(val[0])
                    });
                    const res = await PUT({
                        url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}?valueInputOption=RAW&key=${import.meta.env.VITE_SHEET_AKEY}`,
                        headers: await headers(),
                        data: {
                            values: [...data]
                        }
                    });
                    return await (await res.json()).updatedRange ? { data: dataWillBeRender, msg: 'Successfully updates', ok: true } : { data: [], msg: 'Failed to update', ok: false };
                },
                async users() {
                    const data = jsonRes.values;
                    const users = [];
                    for (const val of data) {
                        if (!val[0]) continue;
                        const { userName, profImgId, email } = parse(val[0]).schema;
                        users.push(stringify({
                            userName,
                            profImgId,
                            email,
                        }));
                    }
                    return Array.from(new Set(users)).map(user => parse(user));
                }
            }
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

// window.addEventListener('click', async () => {
//     await (await getAllSheetValues('Posts')).replaceAllAndUpdate('y'.repeat(40000),'lol')

// })

const simulationBigData = async (range) => {
    const reText = 'y'.repeat(40000)
    const post = { "type": "post", "schema": { "_id": "ad3312ff-5c1f-4a83-ace2-801ddc58843f", "userName": "Yousef Sayed", "userID": "MzA2Mg==", "date": "12/25/2023, 3:49:14 PM", "email": "yousef.sayed1231@gmail.com", "profImgId": "BQACAgQAAxkDAAIC5mWCE4fIEC5yDxM__pjDFsG3K0nuAAIiEwACKr0QUDV-nNHfQZAdMwQ", "postContent": reText, "media": { "images": [], "vid": [], "iframeSrc": [] }, "reacts": { "love": 4, "haha": 0, "sad": 0, "angry": 0 }, "reposts": 0, "watches": 0, "index": 3 } }
    const strPost = [stringify(post)];
    const data = [...repeatAsArray(strPost, 1000)];
    const res = await PUT({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${range}?valueInputOption=RAW&key=${import.meta.env.VITE_SHEET_AKEY}`,
        headers: await headers(),
        data: {
            values: data
        }
    });
    console.log(res);
}

// setTimeout(()=>{simulationBigData('Posts')},7000)

export async function getFromTo(sheetName, from, to) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID}/values/${sheetName}!A${from}:Z${to}?key=${import.meta.env.VITE_SHEET_AKEY}`;
        const res = await (await GET({ url, headers: await headers() }));
        const jsonRes = await res.json()
        const data = jsonRes.values || [];
        // console.log(jsonRes);
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
    console.log(await res);
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
        setTimeout(async () => await update(range, values), 1000)
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
