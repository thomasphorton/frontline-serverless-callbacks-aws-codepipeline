const customerProviderPath = Runtime.getFunctions()['providers/customers'].path;
const { getCustomerById, getCustomersList } = require(customerProviderPath);

exports.handler = async function (context, event, callback) {
    let response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');

    const location = event.Location;

    switch (location) {
        case 'GetCustomerDetailsByCustomerId': {
            response.setBody(await handleGetCustomerDetailsByCustomerIdCallback(event));
            response.setStatusCode(200);
            break;
        }
        case 'GetCustomersList': {
            response.setBody(await handleGetCustomersListCallback(event));
            response.setStatusCode(200);
            break;
        }

        default: {
            console.log('Unknown location: ', location);
            response.setStatusCode(422);
        }
    }

    return callback(null, response);

};

const handleGetCustomerDetailsByCustomerIdCallback = async (event) => {
    console.log('Getting Customer details: ', event.CustomerId);

    const customerId = event.CustomerId;

    // Fetch Customer Details based on their ID
    // and information about a worker, that requested that information
    const customerDetails = await getCustomerById(customerId);

    // Respond with Contact object
    return {
        objects: {
            customer: {
                customer_id: customerDetails.customer_id,
                display_name: customerDetails.display_name,
                channels: customerDetails.channels,
                links: customerDetails.links,
                avatar: customerDetails.avatar,
                details: customerDetails.details
            }
        }
    };
};

const handleGetCustomersListCallback = async (event) => {
    console.log('Getting Customers list');

    const workerIdentity = event.Worker;
    const pageSize = parseInt(event.PageSize);
    const anchor = event.Anchor;
    
    // Fetch Customers list based on information about a worker, that requested it
    const customersList = await getCustomersList(workerIdentity, pageSize, anchor);

    // Respond with Customers object
    return {
        objects: {
            customers: customersList
        }
    };
};
