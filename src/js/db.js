import { get, post, put, stringify, TelegramBot } from './cocktail.js';
const headers = {
    "Authorization": `Bearer ${import.meta.env.VITE_DB_APIKEY}`,
    "X-Spreadsheet-Id": import.meta.env.VITE_DB_ID,
    "Content-Type": "Application/json",
};
const endPoint = 'https://api.sheetson.com/v2/sheets';
const KEY = import.meta.env.VITE_TBTOKEN, chatId = import.meta.env.VITE_CHATID;
const tb = new TelegramBot(KEY, chatId)

const setData = async ({ dbName, data }) => {
    try {
        return await post({
            url:`${endPoint}/${dbName}`,
            data,
            headers,
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

const getData = async ({ dbName, query }) => {
    try {   
        return await(await get({url:`${endPoint}/${dbName}/?${query}` , headers})).json()
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateData = async ({ dbName, rowNum, oldData, newData }) => {
    try {
        if (!rowNum) {
            const rowData = await getData({ dbName: dbName, query: `where=${JSON.stringify(oldData)}` });
            const row = rowData.results[0].rowIndex;
            return await put({
                url:`${endPoint}/${dbName}/${row}`,
                headers,
                data:newData
            });
        }
        else {
            return await put({
                url:`${endPoint}/${dbName}/${rowNum}`,
                headers,
                data:newData
            });
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


const deleteData = async ({ dbName, rowNum, dataTargted }) => {
    try {
        if (!rowNum) {
            const rowData = await getData({ dbName: dbName, query: `where=${JSON.stringify(dataTargted)}` });
            const row = rowData.results[0].rowIndex;
            return await fetch(`${endPoint}/${dbName}/${row}`, { method: "DELETE", headers: headers })
        } else {
            return await fetch(`${endPoint}/${dbName}/${rowNum}`, { method: "DELETE", headers: headers })
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const filterData = async ({dbName , value , boolean})=>{
    try {
        const res = await get({
            url:`${import.meta.env.VITE_ENDPOINT1}/${import.meta.env.VITE_DB_ID}/${dbName}`
        });
        
        if(res.ok){
            const data = [];
            const resData = await res.json();
            for (let i = 0; i < resData.length; i++) {
                if(stringify(resData[i]).includes(value)){
                    data.push(resData[i])
                }                
            }
            if(boolean){
                return data[0] ? {ok:true , data:data} : {ok:false , data:[]}
            }
            return data;
        }else{
            console.warn(res);
        }
    } catch (error) {
        throw new Error(error.message)
    }
   
}

export { setData, getData, updateData, deleteData, filterData,tb }