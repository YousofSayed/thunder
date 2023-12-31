import { CocktailDB, parse } from "./cocktail";


/**
 * Inits indexedDB and returns collection
 * @param {string} collectionName 
 * @returns 
 */
export default async function initAndCreateColIndexedDb(collectionName) {
    const user = parse(localStorage.getItem('user'));
    if (user && user.email) {
        const db = new CocktailDB(user.email);
        const coll =  await db.createCollction(collectionName);
        return coll;
    }
    else{
        throw new Error('Where is name of db?')
    }
}
