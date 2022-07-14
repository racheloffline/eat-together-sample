//create a class to hold he curren device push token
export default class DeviceToken {

    //static holder for the token
    static #token = null;

    //Get the value of the token
    static getToken() {
        return this.#token;
    }

    //Set the value of the token
    static setToken(token) {
        this.#token = token;
    }
}