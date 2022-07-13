'use strict';

const Homey = require('homey');

// Driver for a Daikin Airconditioner
class Driver extends Homey.Driver {
  onPair(session) {
    console.log('onPair(session)');

    //session.setHandler('manual_add', (device, callback) => {
    session.setHandler('manual_add', (device) => {
      //const devices = {};
      const devices = [];
      const request = require('request');
      const url = `http://${device.data.ip}/aircon/get_control_info`;
      console.log(`Connecting to: ${url}`);
      // to be done: add check to prevent that another airco is assigned with same ip-address...
      request(url, (error, response, body) => {
        if (response === null || response === undefined) {
          console.log('Response: ', response);
          session.emit('error', 'http error');
          return response;
        }

        if (!error && (response.statusCode === 200 || response.statusCode === 403)) {
          devices[device.data.id] = {
            id: device.data.id,
            name: device.data.name,
            ip: device.data.ip,
          };
          console.log('Device ID: ', device.data.id);
          console.log('Device name: ', device.data.inputdevicename);
          console.log('Device ip-address: ', device.data.ip);
          session.emit('success', device);
		  return devices;
        } else {
          console.log('Response.statusCode:', response.statusCode);
          session.emit('error', `http error: ${response.statusCode}`);
        }
      });

    });

    // this happens when user clicks away the pairing windows
    session.setHandler('disconnect', () => {
      console.log('Pairing is finished (done or aborted)'); // using console.log because this.log or Homey.log is not a function
    });
  }

  getDeviceType() {
    return this.deviceType ? this.deviceType : false;
  }
}

module.exports = Driver;
