"use strict";
/*

        node-dji

        License in LICENSE file

 */

const EventEmitter = require('events');

// command sent from server (like takeoff, land) considered failed if no response come within this time (milliseconds)
const commandTimeoutMS = 3000; // == 3 seconds

class NodeDJI {
    constructor(socket=null){
        this._socket = socket;
        this.events = new EventEmitter();

        this._connect();
    }

    _connect(){
        if( !this._socket ) return;

        this._socket.on('disconnect', reason => {
            this.events.emit('disconnect', reason);
        } );

        this._socket.on('appState', data => {
            this.events.emit('appState', data);
        });

        this._socket.on('commonTelemetry', data => {
            this.events.emit('commonTelemetry', data);
        });

        this._socket.on('attitudeTelemetry', data => {
            this.events.emit('attitudeTelemetry', data);
        });
    }

    updateSocket(socket){
        if( this._socket ) this._socket.disconnect(true);
        this._socket = socket;
        this._connect()
    }

    on(event, handler){
        this.events.on(event, handler);
    }

    off(event, handler){
        this.events.off(event, handler);
    }

    isConnected(){
        try {
            return this._socket ? this._socket.conn.readyState === 'open' : false;
        }
        catch( err ){
            return false;
        }
    }

    getName(){
        const _this = this;
        return "Test name"; // TODO
    }

    getSerialNumber(){
        const _this = this;
        return "FAKE-1234567890"; // TODO
    }

    _commandWithAck(command, params = null){
        const _this = this;
        return new Promise(function(resolve, reject){
            if( !_this.isConnected() ) return reject('No connection');
            let timeout = setTimeout( () => { reject('timeout') }, commandTimeoutMS);
            _this._socket.emit('commandWithAck', [command, params], response => {
                clearTimeout(timeout);
                console.log(response);
                resolve(response);
            });
        });
    }

    takeOff(){
        return this._commandWithAck('takeOff');
    }

    land(){
        return this._commandWithAck('land', {pos: 32423});
    }

    returnToHome(){
        return this._commandWithAck('rth');
    }


}


module.exports = NodeDJI;
