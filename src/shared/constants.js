// This file is shared by REACT (es6) and ELECTRON (es5), 
// ...therefore es5 format is used for compatability reasons.
// ...File contains different channels for Main and renderer process
// ...communincation

module.exports = {
  channels: {
    APP_INFO: 'app_info',
    PORT_MESSAGE: 'port_message',
  },
};