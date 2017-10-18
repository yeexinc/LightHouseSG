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
        var thisObj = this;
        var sendData = { "accname": name, "password": password };
        /*
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
        });*/
        this.initializeFirebaseEvents();
        callbackFunc(this.dbStub.placeholderVerification(name), thisObj.navigator);
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

    onSuccess(data) {
        console.log("API call successful. Returning " + data.status);
        return data.status;
    }

    onError() {
        console.log("API call failed");
    }
}