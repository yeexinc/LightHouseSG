import React from 'react';
import ReactDOM from 'react-dom';

import * as firebase from 'firebase';

import { DBStub } from './DBStub';

export class DBController extends React.Component {
    constructor(navigator) {
        // Add initialization as needed here
        super();
        this.navigator = navigator;
        this.dbStub = new DBStub();
        this.ref = null; //firebase database ref

        this.initializeFirebase();

        this.newErrAddedCallback = null;
        this.newNotifCallback = null;
        this.newOfferCallback = null;
        this.newAcceptOfferCallback = null;
        this.newConcludeCallback = null;

        console.log("Database initialized");
    }

    initializeFirebase() {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyAwRrdIOfm8UPtdWTK9kGWixPdJVmavGk8",
            authDomain: "project-1-1e42f.firebaseapp.com",
            databaseURL: "https://project-1-1e42f.firebaseio.com",
            projectId: "project-1-1e42f",
            storageBucket: "project-1-1e42f.appspot.com",
            messagingSenderId: "742959947484"
        };
        firebase.initializeApp(config);
        this.ref = firebase.database().ref();
    }

    // Called when the user has logged in.
    initializeFirebaseEvents() {
        var thisObj = this;
        this.ref.on("child_added", function (snapshot, prevChildKey) {
            if (!thisObj.newChild) return;
            var newChild = snapshot.val();
            console.log("Child added: ", newChild);

            // If the child is a new errand added by beneficiary, update the notification page
            if (newChild.newNotifErr) {
                var newNotif = newChild.newNotifErr;
                if (thisObj.newErrAddedCallback) thisObj.newErrAddedCallback(newNotif);
                if (thisObj.newNotifCallback) thisObj.newNotifCallback(newNotif);
            }
            else if (newChild.newOfferErr) {
                // If the child is an offer accepted by the volunteer, update the errands page
                var newOffer = newChild.newOfferErr;
                if (thisObj.newOfferCallback) thisObj.newOfferCallback(newOffer);
            }
            else if (newChild.newAcceptOffer) {
                var newAccept = newChild.newAcceptOffer;
                if (thisObj.newAcceptOfferCallback) thisObj.newAcceptOfferCallback(newAccept);
            }
            else if (newChild.newConcludeErr) {
                var newAccept = newChild.newConcludeErr;
                if (thisObj.newConcludeCallback) thisObj.newConcludeCallback(newAccept);
            }
        });

        this.ref.once('value', function (messages) {
            thisObj.newChild = true;
        });
    }

    // An example function of adding data to firebase
    // Beneficiary adds a new errand
    addNewNotif(errand) {
        this.ref.push({ "newNotifErr": errand });
    }

    // For server integration
    addNewErrand(errand) {
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/errands/insert/new",
            contentType: "application/x-www-form-urlencoded",
            data: errand,
            success: function (data) {
                var errid = data;
                console.log("Errand submitted to server with ID: ", errid);
            },
            error: function () {
                console.log("An error occured with post new errand API call");
            }
        });
    }

    registerNewErrAddedCallback(callbackFunc) {
        this.newErrAddedCallback = callbackFunc;
    }

    registerNewNotifCallback(callbackFunc) {
        this.newNotifCallback = callbackFunc;
    }

    // Volunteers offers to take up the errand
    addNewOffer(errand) {
        this.ref.push({ "newOfferErr": errand });
    }

    registerNewOfferCallback(callbackFunc) {
        this.newOfferCallback = callbackFunc;
    }

    // Beneficiary accepts volunteer's offer
    addAcceptOffer(errand) {
        this.ref.push({ "newAcceptOffer": errand });
    }

    registerNewAcceptOfferCallback(callbackFunc) {
        this.newAcceptOfferCallback = callbackFunc;
    }

    // Beneficiary concludes an errand
    addNewConclude(errand) {
        this.ref.push({ "newConcludeErr": errand });
    }

    registerNewConcludeCallback(callbackFunc) {
        this.newConcludeCallback = callbackFunc;
    }

    appendCompletedErrand(userID, errand) {
        this.dbStub.appendCompletedErrand(userID, errand);
    }

    logout() {
        console.log("Deleting firebase reference");
        firebase.app("[DEFAULT]").delete();
    }

    verifyUser(name, password, callbackFunc) {
        // Do the API call to database here
        var userid;
        var usertypeid;
        var thisObj = this;
        var sendData = { "accname": name, "password": password };
        
        // Comment out the whole ajax call if using stub
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/login",
            contentType: "application/x-www-form-urlencoded",
            data: sendData,
            success: function (data) {
                userid = thisObj.onSuccess(data);
                if (userid == null){
                    callbackFunc(userid, thisObj.navigator);
                }
                else{
                    console.log('Userid obtained, retrieve bene/vol id next for: ', userid);
                    thisObj.initializeFirebaseEvents();
                    thisObj.gettypeid(userid, thisObj, callbackFunc);
                }
            },
            error: function () {
                thisObj.onError();
            }
        });

        // Comment out if using server
        // this.initializeFirebaseEvents();
        // callbackFunc(this.dbStub.placeholderVerification(name), thisObj.navigator);
    }

    gettypeid(userid, thisObj, callbackFunc) {
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/account/check",
            contentType: "application/x-www-form-urlencoded",
            data: userid,
            success: function (data) {
                console.log("Successfully checked user account, usertype id is", data);
                var usertypeid = data;
                thisObj.getUserDetails(userid, usertypeid, thisObj, callbackFunc);
            },
            error: function () {
                console.log("Account check API call failed");
            }
        });
    }

    getUserDetails(userid, usertypeid, thisObj, callbackFunc) {
        var usertype = usertypeid.beneid ? "beneficiary" : "volunteer";
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: "http://45.76.189.70:5000/api/v1.0/" + usertype + "/get/info",
            contentType: "application/x-www-form-urlencoded",
            data: usertypeid,
            success: function (data) {
                var compatibledata = {
                    "userID": userid.userid,
                    "usertypeID": usertypeid.beneid ? usertypeid.beneid : usertypeid.volid,
                    "accName": data.username,
                    "userType": usertype,
                    "email": data.email,
                    "postalCode": data.postalcode,
                    "phoneNumber": data.phonenum,
                    "createdDate": "dd/mm/yy",
                    "organization": data.organization,
                    "gender": data.gender,
                    "completedErrands": []
                };

                callbackFunc(compatibledata, thisObj.navigator);
                console.log("Successfully retrieved details for account: ", data); 
                console.log("After processing: ", compatibledata);                   
            },
            error: function () {
                console.log("Details retrieval API call failed");
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

    // Get the matched errands for notifications page
    getPendingErrands(userID, callbackFunc) {
        // Do the AJAX call here
        // ...

        //var result = this.dbStub.getListedErrands(userID);
        //callbackFunc(result);
        return this.dbStub.getPendingErrands(userID);
    }

    // get a number of the most popular tags
    getErrandTags() {
        // Do the AJAX call here
        // ...

        return this.dbStub.getErrandTags(); 
    }

    // Only used for stub, integrate new user created tag into database
    appendNewErrandTag(tag){
        this.dbStub.appendNewErrandTag(tag);
    }

    onSuccess(data) {
        if (data.status == false){
            console.log("API call successful. User unregistered");
            return null;
        }
        else{
            console.log("API call successful. User exists");
            return data;
        }
    }

    onError() {
        console.log("API call failed");
    }
}