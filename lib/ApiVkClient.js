const Promise = require("bluebird");
const url = require("url");
let rp = require("request-promise");

const VK_API_ENDPOINT = "https://api.vk.com/method/";
const VK_API_VERSION = "5.60";

class ApiVkClient {
  /**
   * @param accessToken {string}
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * @private
   * @param method {string}
   * @param params {object}
   * @returns {string}
   */
  buildUrl(method, params) {
    const query = params || {};
    query.v = VK_API_VERSION;
    query.access_token = this.accessToken;
    return VK_API_ENDPOINT + url.format({ pathname: method, query });
  }

  /**
   * @param method {string}
   * @param params {object}
   * @returns {Promise<object>}
   */
  apiPost(method, params) {
    const uri = this.buildUrl(method);
    return new Promise((resolve, reject) => {
      rp({ method: "POST", uri, form: params })
        .then((response) => JSON.parse(response))
        .then((response) => {
          if ("error" in response) {
            throw new Error(response.error.error_msg, response.error_code);
          }
          resolve(response);
        }).catch((error) => reject(error));
    });
  }

  /**
   * @param method {string}
   * @param params {object}
   * @returns {Promise<object>}
   */
  apiGet(method, params) {
    const uri = this.buildUrl(method, params);
    return new Promise((resolve, reject) => {
      rp({ method: "GET", uri })
        .then((response) => JSON.parse(response))
        .then((response) => {
          if ("error" in response) {
            throw new Error(response.error.error_msg, response.error_code);
          }
          resolve(response);
        }).catch((error) => reject(error));
    });
  }

  /**
   * @param userId {number}
   * @param message {string}
   * @return {Promise<number>}
   */
  sendMessageToUser(userId, message) {
    return this.apiPost("messages.send", { user_id: userId, message });
  }

  /**
   * @param messageIds {Array}
   */
  markMessagesAsRead(messageIds) {
    return this.apiPost("messages.markAsRead", { message_ids: messageIds.join(",") });
  }
}

module.exports = ApiVkClient;
