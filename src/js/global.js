import { $,  copyToClipboard,  GET, parse, POST, PUT, stringify } from "./cocktail";

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

export async function getAllSheetValues(sheetName) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${sheetName}?key=${env('VITE_SHEET_AKEY')}`;
        const res = await (await GET({ url, headers: await headers() }));
        const jsonRes = await res.json()
        if (res.status == 200) {
            const data = handleValues(jsonRes.values);
            return {
                data,
                filter: async (key, value) => {
                    const result = [];
                    for (const val of data) { //I used for insted of filter method because of fast performance
                        if (val[key].includes(value)) {
                            result.push(val)
                        }
                    }
                    return result[0] ? result : null;
                }
            }
        } 
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function getFromTo(sheetName , from , to) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${sheetName}!A${from}:Z${to}?key=${env('VITE_SHEET_AKEY')}`;
        const res = await (await GET({ url, headers: await headers() }));
        const jsonRes = await res.json()
        const data = jsonRes.values;
        if (res.status == 200) {
            const rangedData = data.map((item)=>{
                item = parse(item);
                console.log(item.schema);
            item.schema.index = from;
            from++
            return item;
            });
            return rangedData;
        } 
        return [];
    } catch (error) {
        throw new Error(error.message)
    }
}


export async function append(range, values) {
    const res = await POST({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${range}:append?valueInputOption=RAW&key=${env('VITE_SHEET_AKEY')}`,
        headers: await headers(),
        data: {
            values: [[stringify(values)]]
        },
        json: true,
    })

    console.log(res);
}

export async function update(range , values) {
   try {
    const res = await PUT({
        url:`https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${range}?valueInputOption=RAW&key=${env('VITE_SHEET_AKEY')}`,
        headers:await headers(),
        data:{
            values:[[stringify(values)]]
        }
    }); 
    
    // console.log(res);
    return res;
   } catch (error) {
    update(range ,value);
    throw new Error(error.message);
   }
}

export async function clear(range) {

   try {
    const res = await POST({
        url:`https://sheets.googleapis.com/v4/spreadsheets/${env('VITE_DB_ID')}/values/${range}:clear?alt=json&key=${env('VITE_SHEET_AKEY')}`,
        headers:await headers(),
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
            client_id: env('VITE_CLIENT_ID'),
            client_secret: env('VITE_CLIENT_SECRET'),
            refresh_token: env('VITE_REFRESH_TOKEN'),
            grant_type: `refresh_token`
        }
    })).access_token
}



// const POSTtDb = JSON.stringify({
//     name: 'Thunder sayed',
//     ImageId: 'https://api.telegram.org/file/bot6183481793:AAGFNrrvs6FgATrNhtG5P1j9SAQ0AHxCsyQ/documents/file_952.jpg',
//     textContent: `y`.repeat(45000),
// })

// const cell = [POSTtDb];


// const baseRowAuth = `OWp20xuYhcEkrUBFNYM5S5jbUnaG5dav`

// // console.log(await (await GET({
// //     url: "https://api.baserow.io/api/database/rows/table/223500/?user_field_names=true&search='o'",
// //     headers: {
// //         Authorization: "Token OWp20xuYhcEkrUBFNYM5S5jbUnaG5dav"
// //     }
// // })).json());


// const POSTtC = JSON.stringify({

// })


// console.log(await GETAToken());
// console.log(await append('Users', cell));
// setInterval(async () => {
//     // console.log(await(await GETAllSheetValues('Users')).filter('name','sayed'));
//     console.log(

//         await POSTt({
//             url: "https://api.baserow.io/api/database/rows/table/223500/?user_field_names=true",
//             headers: {
//                 Authorization: `Token ${baseRowAuth}`,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "user": "haha",
//                 "POSTtContent": 'yousef sayed ahmed',
//             }
//         })
    
//     );
// }, 50)
// console.log(await compress(`yousef `.repeat(45000) ));