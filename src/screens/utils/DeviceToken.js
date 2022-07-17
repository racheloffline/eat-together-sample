//create a class to hold he curren device push token
export default class DeviceToken {

    //static holder for he token
    static _token = null;

    //Get the value of the token
    static getToken() {
        return this._token;
    }

    //Set the value of the token
    static setToken(token) {
        this._token = token;
    }
}