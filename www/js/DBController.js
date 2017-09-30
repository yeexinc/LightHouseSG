import React from 'react';
import ReactDOM from 'react-dom';

export class DBController extends React.Component {

    constructor() {
        // Add initialization as needed here
        super();
        console.log("Database initialized");
    }

    verifyUser(name, password, callbackFunc) {
        // Do the API call to database here
        var thisObj = this;
        var result = null;

        var sendData = { "accname": "admin", "password": "admin123" };
        console.log("Sending data: " + sendData);
        
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/login",
            contentType: "application/x-www-form-urlencoded",
            data: sendData,
            success: function(data) {
                var result = thisObj.onSuccess(data);
                callbackFunc(result);
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