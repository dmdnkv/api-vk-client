const rewire = require("rewire");
const Promise = require("bluebird");
const ApiVkClient = rewire("../src/ApiVkClient");

const ACCESS_TOKEN = "sometesttoken";

module.exports = {
  setUp(callback) {
    this.client = new ApiVkClient(ACCESS_TOKEN);
    callback();
  },
  tearDown(callback) {
    callback();
  },
  testBuildQuery(test) {
    test.equals(
      this.client.buildUrl("messages.send", { user_id: 123, message: "test" }),
      `https://api.vk.com/method/messages.send?user_id=123&message=test&v=5.60&access_token=${ACCESS_TOKEN}`
    );
    test.done();
  },
  testSendMessageToUser(test) {
    ApiVkClient.__set__("rp", () => new Promise((resolve) => resolve(`{"result": "ok"}`)));
    this.client.sendMessageToUser(123, "test")
      .then((response) => {
        test.equals(response.result, "ok");
        test.done();
      }).catch(() => test.done());
  },
  testMarkMessagesAsRead(test) {
    ApiVkClient.__set__("rp", () => new Promise((resolve) => resolve(`{"result": "ok"}`)));
    this.client.markMessagesAsRead([123])
      .then((response) => {
        test.equals(response.result, "ok");
        test.done();
      }).catch(() => test.done());
  },
  testError(test) {
    ApiVkClient.__set__("rp", () => new Promise((resolve) => resolve(`{"error": "failed"}`)));
    this.client.apiPost("test.method", { some: "value" })
      .then(() => test.done())
      .catch((error) => {
        test.equals(error.message, "failed");
        test.done();
      });
  },
};
