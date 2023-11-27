import { TelegramBot } from "./cocktail";
import { env } from "./global";
export default new TelegramBot(env('VITE_TBTOKEN'), env('1082707467')) 