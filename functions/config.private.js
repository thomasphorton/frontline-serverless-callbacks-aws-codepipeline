require('dotenv').config();

const _ = (varName, defaults) => process.env[varName] || defaults || null;

module.exports = {
    twilio: {
        sms_number: _('TWILIO_SMS_NUMBER'),
        whatsapp_number: _('TWILIO_WHATSAPP_NUMBER')
    },
};
