## ApiVkClient ##

VK API Client written in Node.JS (all methods return promises provided by [bluebird](http://bluebirdjs.com/docs/getting-started.html) library)

## Example ##

```

const ApiVkClient = require("api-vk-client");
const client = new ApiVkClient("ACCESS_TOKEN_HERE");

// the same as call "sendMessageToUser"  
client.apiPost("messages.send", { user_id: 185014513, message: "Test Message"})
  .then(response => console.log(response))
  .catch(error => console.log(error));
    
client.sendMessageToUser(185014513, "Test Message")
  .then(response => console.log(response))
  .catch(error => console.log(error));    
```
