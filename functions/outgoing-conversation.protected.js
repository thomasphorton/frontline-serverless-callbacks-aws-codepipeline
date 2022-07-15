const configPath = Runtime.getFunctions()['config'].path;
const config = require(configPath);

console.log(config);

exports.handler = async function (context, event, callback) {
    let response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');

    console.log(event);
    const location = event.Location;

    switch (location) {
        case 'GetProxyAddress': {
            let { body, statusCode } = await getProxyAddress(event);
            response.setBody(body);
            response.setStatusCode(statusCode);
            break;
        }

        default: {
            console.log('Unknown location: ', location);
            response.setStatusCode(422);
        }
    }

    return callback(null, response);

};

const getProxyAddress = (event) => {
    console.log('Getting Proxy Address');

    const channelName = event.ChannelType;
    const proxyAddress = getCustomerProxyAddress(channelName);

    // In order to start a new conversation ConversationsApp need a proxy address
    // otherwise the app doesn't know from which number send a message to a customer
    if (proxyAddress) {
        console.log("Got proxy address!");

        return({
            statusCode: 200,
            body: { proxy_address: proxyAddress }
        });
    }
    else {
        console.log("Proxy address not found");

        return({
            statusCode: 403
        })
    }
};

const getCustomerProxyAddress = (channelName) => {
    if (channelName === 'whatsapp') {
        return config.twilio.whatsapp_number;
    } else {
        return config.twilio.sms_number;
    }
};