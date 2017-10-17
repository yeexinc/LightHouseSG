import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { UserPage } from './UserPage';
import { OfferErrand, AcceptedErrand, PageToolbar, currentDateTime } from './utilities/PageUtilities';


export class ErrandsPage extends React.Component {
    constructor(props) {
        super(props);
        this.navigator = props.navigator;
        this.database = props.database;
        this.user = props.user;

        this.ongoingErrands = [];
        this.onErrandLoaded = this.onErrandLoaded.bind(this);
        this.onRespondBtnClicked = this.onRespondBtnClicked.bind(this);
        this.onConcludeBtnClicked = this.onConcludeBtnClicked.bind(this);

        this.state = {
            errandLoaded: false
        }
        this.database.registerNewOfferCallback(this.onNewOfferAdded.bind(this));
        this.database.registerNewAcceptOfferCallback(this.onOfferAccepted.bind(this));
        this.database.registerNewConcludeCallback(this.onErrandConcluded.bind(this));
    }

    componentWillMount() {

        // Get the ongoing errand from the database
        if (!this.state.errandLoaded) {
            this.database.getOngoingErrand(1, this.onErrandLoaded);
        }
    }

    // The callback function passed to the database to be executed after the errand has been fetched
    onErrandLoaded(result) {
        if (result) this.ongoingErrands.push(result);
        this.setState({ errandLoaded: true });
    }

    // Callback function passed to the db to be executed when new offers are added by volunteers
    // for volunteers, they can have one ongoing errand at a time
    onNewOfferAdded(offer) {
        
        if (offer) {
            if (this.user.userType == 'volunteer') {
                this.ongoingErrands = [offer];
            }
            else {
                // For beneficiaries, go through the current ongoing errands and update it
                // to show that a volunteer has given an offer
                for (var i = 0; i < this.ongoingErrands.length; i++) {
                    if (offer.errID == this.ongoingErrands[i].errID) {
                        this.ongoingErrands[i] = offer; // Update the errand
                        break;
                    }
                }
            }
        }

        this.setState({ errandLoaded: true });
    }

    // Callback function passed to the db to be executed when beneficiary accepts an offer
    onOfferAccepted(errand) {
        // Update for volunteer's side
        if (this.user.userType == 'volunteer') {
            if (this.ongoingErrands[0].errID == errand.errID) {
                this.ongoingErrands[0] = errand; // Update the errand status
            }
        }
        this.setState({ errandLoaded: true });
    }

    // Callback function passed to the db to be executed when beneficiary concludes an errand
    onErrandConcluded(errand) {
        if (this.user.userType == 'volunteer') {
            if (this.ongoingErrands[0].errID == errand.errID) {
                // Empty the list since they've completed the (only) ongoing errand
                this.ongoingErrands = [];
                // Update for user page
                this.database.appendCompletedErrand(this.user.userID, errand);
            }
        }
        else {
            // Update for user page
            this.database.appendCompletedErrand(this.user.userID, errand);
        }
        this.setState({ errandLoaded: true });
    }

    // Beneficiary accepts/rejects an offer
    onRespondBtnClicked(respond, errID) {
        if (respond) { // This function will only be executed on beneficiary's side
            for (var i = 0; i < this.ongoingErrands.length; i++) {
                if (errID == this.ongoingErrands[i].errID) {
                    var acceptedErrand = this.ongoingErrands[i];
                    acceptedErrand.status = "accepted";
                    acceptedErrand.updatedDate = currentDateTime();
                    this.ongoingErrands[i] = acceptedErrand; // Update the errand
                    this.database.addAcceptOffer(acceptedErrand);
                    break;
                }
            }
        }
        else {
            // I still don't really know what to do with this
            // TODO: this part is incomplete
            for (var i = 0; i < this.ongoingErrands.length; i++) {
                if (errID == this.ongoingErrands[i].errID) {
                    var acceptedErrand = this.ongoingErrands[i]; // Update the errand
                    acceptedErrand.status = "listed";
                    acceptedErrand.volID = null; // unassign the volunteer
                    acceptedErrand.volName = null;
                    this.ongoingErrands[i] = acceptedErrand;
                    break;
                }
            }

        }
    }

    onConcludeBtnClicked(respond, errID, comment = null, rating = null) {
        if (respond) { // This function will only be executed on beneficiary's side
            for (var i = 0; i < this.ongoingErrands.length; i++) {
                if (errID == this.ongoingErrands[i].errID) {
                    var concludedErr = this.ongoingErrands[i];
                    concludedErr.status = "completed";
                    concludedErr.beneComment = comment;
                    concludedErr.beneRate = rating;
                    concludedErr.updatedDate = currentDateTime();
                    this.ongoingErrands.splice(i, 1); // Remove the errand from the ongoing list
                    this.database.addNewConclude(concludedErr);
                    break;
                }
            }
        }
        else {
            console.log("concluding cancelled");
        }
    }

    // Example function (should be removed from this page afterwards)
    addNewNotif() {
        var curTime = currentDateTime();

        var sampleErrand = {
            "errID": 1,
            "beneID": 2,
            "beneName": "Ben",
            "volID": null,
            "status": "listed",
            "title": "Sample Errand",
            "description": "Just a sample errand added.",
            "postedDate": curTime,
            "tags": "#apple #pie",
            "beneRate": null,
            "beneComment": null
        }
        this.database.addNewNotif(sampleErrand);

        if (this.user.userType == 'beneficiary') {
            this.onErrandLoaded(sampleErrand);
        }
    }

    // Converts an Errand object to rendered JSX object
    getErrandVar(ongoingErrand, key = null) {
        if (ongoingErrand.status == 'accepted') {
            return <AcceptedErrand errand={ongoingErrand} navigator={this.navigator} database={this.database} userType={this.user.userType} volID={ongoingErrand.volID} volName={ongoingErrand.volName} onRespondBtnClicked={this.onConcludeBtnClicked} key={key} />;
        }
        else { // Awaiting response
            return <OfferErrand errand={ongoingErrand} navigator={this.navigator} database={this.database} userType={this.user.userType} volID={ongoingErrand.volID} volName={ongoingErrand.volName} updatedDate={ongoingErrand.updatedDate} onRespondBtnClicked={this.onRespondBtnClicked} key={key} />;
        }
    }

    render() {
        var ongoingErrandText = "Loading ongoing errand...";
        var ongoingErrandVar = null;

        if (this.state.errandLoaded) {
            //ongoingErrandText = (this.ongoingErrands.length > 0) ? "You have one ongoing errand." : "You do not have any ongoing errands.";

            // Render the page differently for volunteers and beneficiaries
            // This is like the messiest coding ever??? (7 parameters for OfferErrand wtf)
            if (this.ongoingErrands.length > 0) {
                if (this.user.userType == 'volunteer') { // For volunteers
                    ongoingErrandText = "You have one ongoing errand.";
                    var ongoingErrand = this.ongoingErrands[0];
                    ongoingErrandVar = this.getErrandVar(ongoingErrand);
                } else { // For beneficiaries
                    ongoingErrandVar = []; // Beneficiaries can have >1 ongoing errands
                    for (var i = 0; i < this.ongoingErrands.length; i++) {
                        var ongoingErrand = this.ongoingErrands[i];
                        var key = "offer-errand-" + i;
                        ongoingErrandVar.push(this.getErrandVar(ongoingErrand, key));
                    }
                    ongoingErrandText = "You have " + i + " ongoing errand(s).";
                }
            } else {
                ongoingErrandText = "You do not have any ongoing errands.";
            }
        }

        var addSampleErrand = (this.user.userType == 'beneficiary') ? <p onClick={this.addNewNotif.bind(this)} className="addSampleErrand">Add a sample errand</p> : null;
        return (
            <Ons.Page>
                <section className="pageContent">
                    Welcome, {this.user.accName}!
                        <br /> {ongoingErrandText}
                    {ongoingErrandVar}
                    <br />
                    {addSampleErrand}
                </section>
            </Ons.Page>
        );
    }
}