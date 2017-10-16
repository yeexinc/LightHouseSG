import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { UserPage } from './UserPage';
import { Errand } from './utilities/PageUtilities';


export class ErrandsPage extends React.Component {
    constructor(props) {
        super(props);
        this.navigator = props.navigator;
        this.database = props.database;
        this.user = props.user;

        this.onErrandLoaded = this.onErrandLoaded.bind(this);

        this.state = {
            errandLoaded: false
        }
        this.database.registerNewOfferCallback(this.onNewOfferAdded.bind(this));
    }

    componentWillMount() {

        // Get the ongoing errand from the database
        if (!this.state.errandLoaded) {
            this.database.getOngoingErrand(1, this.onErrandLoaded);
        }
    }

    // The callback function passed to the database to be executed after the errand has been fetched
    onErrandLoaded(result) {
        this.ongoingErrand = result;
        this.setState({ errandLoaded: true });
    }

    onNewOfferAdded(offer) {
        this.ongoingErrand = offer;
        this.setState({ errandLoaded: true });
    }

    // Example function (should be removed from this page afterwards)
    addNewNotif() {
        var sampleErrand = {
            "errID": 1,
            "beneID": 2,
            "beneName": "Ben",
            "volID": null,
            "status": "listed",
            "title": "Sample Errand",
            "description": "Just a sample errand added.",
            "postedDate": "16 Oct, 11:30pm",
            "tags": "#apple #pie",
            "beneRate": null,
            "beneComment": null
        }
        this.database.addNewNotif(sampleErrand);

        if (this.user.userType == 'beneficiary') {
            this.ongoingErrand = sampleErrand;
        }
        this.setState({ errandLoaded: true });
    }

    render() {
        var ongoingErrandText = "Loading ongoing errand...";

        if (this.state.errandLoaded) {
            ongoingErrandText = (this.ongoingErrand) ? "You have one ongoing errand." : "You do not have any ongoing errands.";
        }

        var ongoingErrandVar = null;
        if (this.ongoingErrand) {
            var volID = this.ongoingErrand.volID;
            var volName = this.ongoingErrand.volName;
            ongoingErrandVar = <Errand errand={this.ongoingErrand} navigator={this.navigator} database={this.database} userType={this.user.userType} volID={volID} volName={volName} />
        }
        return (
            <Ons.Page>
                <section className="pageContent">
                    Welcome, {this.user.accName}!
                        <br /> {ongoingErrandText}
                    {ongoingErrandVar}
                    <p onClick={this.addNewNotif.bind(this)}>Add me</p>
                </section>
            </Ons.Page>
        );
    }
}