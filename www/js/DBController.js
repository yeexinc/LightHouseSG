import React from 'react';
import ReactDOM from 'react-dom';

export class DBController extends React.Component {

    constructor() {
        // Add initialization as needed here
        super();
        console.log("Database initialized");
    }

    verifyUser(name, password) {
        // Do the API call to database here
        var onError = this.onError;
        var thisObj = this;

        /*
        $.ajax({
            type: "POST",
            dataType: "json",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/login",
            contentType: "application/x-www-form-urlencoded",
            data: JSON.stringify({ "accname": "admin", "password": "admin123" }),
            success: function(data) {
                thisObj.onSuccess(data);
            },
            error: onError
        });*/

        // Return true for now
        return true;
    }

    onSuccess(data) {
        console.log(data.status);

        // TODO: If the status returned is "success", should return true to 
        // log in the user.

        console.log("API call successful");
    }

    onError() {
        console.log("API call failed");
    }

}