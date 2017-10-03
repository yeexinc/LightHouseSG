import React from 'react';
import ReactDOM from 'react-dom';

export class DBController extends React.Component {

    constructor(navigator) {
        // Add initialization as needed here
        super();
        this.navigator = navigator;
        console.log("Database initialized");
    }

    verifyUser(name, password, callbackFunc) {
        // Do the API call to database here
        var thisObj = this;
        var result = null;

        var sendData = { "accname": name, "password": password };
        console.log("Sending data: " + sendData);
        
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/login",
            contentType: "application/x-www-form-urlencoded",
            data: sendData,
            success: function(data) {
                var result = thisObj.onSuccess(data);
                console.log("AJAX call successful, executing callback function...");
                callbackFunc(result, thisObj.navigator);
                console.log("Callback function executed");
            },
            error: function() {
                thisObj.onError();
            }
        });
    }

    onSuccess(data) {
        console.log("API call successful. Returning " + data.status);
        return data.status;
    }

    onError() {
        console.log("API call failed");
    }
}