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
            success: function (data) {
                var result = thisObj.onSuccess(data);
                console.log("Successfully verified user");
                callbackFunc(result, thisObj.navigator);
            },
            error: function () {
                thisObj.onError();
            }
        });
    }

    getUser(userID, callbackFunc, userPage) {
        // Do the AJAX call here
        //...
        var result = this.dbStub.getUser(userID);
        if (callbackFunc) {
            callbackFunc(result, userPage);
        }
        else return result;
        // This function is not supposed to return anything;
        // but it's here for testing purposes (for createMainPage() in LoginPage)
        // the database should return the user directly once the login is successful
        // so that this function does not need to be called
    }

    getOngoingErrand(userID, callbackFunc) {
        // Do the AJAX call here
        //...
        var result = this.dbStub.getOngoingErrand(userID);
        callbackFunc(result); //onErrandLoaded(result)
    }

    getCompletedErrands(userID, callbackFunc) {
        // Do the AJAX call here
        //...
        return this.dbStub.getCompletedErrands(userID);
    }

    // Get the matched errands for notifications page
    getListedErrands(userID, callbackFunc) {
        // Do the AJAX call here
        // ...
        var result = this.dbStub.getListedErrands(userID);
        callbackFunc(result);
    }

    onSuccess(data) {
        console.log("API call successful. Returning " + data.status);
        return data.status;
    }

    onError() {
        console.log("API call failed");
    }
}