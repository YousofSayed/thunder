import { TelegramBot } from "./cocktail";
import { env } from "./global";
const tb = new TelegramBot(env('VITE_TBTOKEN'), env('VITE_CHATID')) 
export default tb   