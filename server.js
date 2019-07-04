"use strict";
/*

        node-dji

        License in LICENSE file

 */

const config = {

    // This key should be equal to one in mobile app settings
    ioAuthKey: 'abcd1234',

    // Server port to listen to
    ioServerPort: 8005

};


const io_server = require('socket.io')(config.ioServerPort);
const NodeDJI = require('./node-dji/node-dji');


// Server connection handler
io_server.on('connection', socket => {

    // Check if AuthKey is OK
    let authKey_from_app = socket.handshake.headers.authkey;
    if( authKey_from_app !== config.ioAuthKey ){
        console.log("Connection with wrong auth key", authKey_from_app, "Aborting...");
        socket.disconnect(true);
        return;
    }

    console.log('Drone connected!');

    //
    // Create new NodeDJI instance
    let drone = new NodeDJI(socket);

    //
    //    Get drone info
    //

    console.log("Drone's name:", drone.getName() );
    console.log("Drone's SN:", drone.getSerialNumber() );


    //
    //    Listeners for streaming data
    //

    // Print out app state values
    drone.on('appState', values => console.log(values) );

    // Print out common telemetry values
    drone.on('commonTelemetry', values => console.log(values) );

    // Print out app attitude telemetry values
    drone.on('attitudeTelemetry', values => console.log(values) );

    // Drone disconnected
    drone.on('disconnect', reason => console.log('Drone disconnected, reason', reason) );



    //
    //    Perform actions
    //
    drone.takeOff()
        .then( response => {
            // Command executed on the app
            console.log("Takeoff command succeeded with", response);
        })
        .catch( error_message => {
            console.log('Failed to takeoff', error_message);
        });

    drone.land()
        .then( response => {
            // Command executed on the app
            console.log("Land command succeeded with", response);
        })
        .catch( error_message => {
            console.log('Failed to land', error_message);
        });

    drone.returnToHome()
        .then( response => {
            // Command executed on the app
            console.log("RTH command succeeded with", response);
        })
        .catch( error_message => {
            console.log('Failed to RTH', error_message);
        });


});
