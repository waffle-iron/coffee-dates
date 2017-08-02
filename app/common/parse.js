import Parse from 'parse';
import {
  PARSE_API_KEY,
  PARSE_JS_KEY,
  SERVER_URL,
} from './constants';

// NB: does this code run everytime Parse is imported???
Parse.initialize(PARSE_API_KEY, PARSE_JS_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;
