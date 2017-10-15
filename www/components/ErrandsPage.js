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
                </section>
            </Ons.Page>
        );
    }
}