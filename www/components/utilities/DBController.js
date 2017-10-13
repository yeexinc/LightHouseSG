import React from 'react';
import ReactDOM from 'react-dom';

import { DBStub } from './DBStub';

export class DBController extends React.Component {

    constructor(navigator) {
        // Add initialization as needed here
        super();
        this.navigator = navigator;
        this.dbStub = new DBStub();
        console.log("Database initialized");
    }

    verifyUser(name, password, callbackFunc) {
        // Do the API call to database here
        var thisObj = this;
        var result = null;
        var sendData = { "accname": name, "password": password };
        
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/login",
            contentType: "application/x-www-form-urlencoded",
            data: sendData,
            success: function(data) {
                var result = thisObj.onSuccess(data);
                console.log("Successfully verified user");
                callbackFunc(result, thisObj.navigator);
            },
            error: function() {
                thisObj.onError();
            }
        });
    }

    getUser(userID, callbackFunc) {
        // Do the AJAX call here
        //...
        return this.dbStub.getUser(userID);
    }
    
    getOngoingErrand(userID, callbackFunc) {
        // Do the AJAX call here
        //...
        return this.dbStub.getOngoingErrand(userID);
    }

    getCompletedErrands(userID, callbackFunc) {
        // Do the AJAX call here
        //...
        return this.dbStub.getCompletedErrands(userID);
    }

    onSuccess(data) {
        console.log("API call successful. Returning " + data.status);
        return data.status;
    }

    onError() {
        console.log("API call failed");
    }
}