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

        this.ongoingErrand = this.database.getOngoingErrand(1, null);

    }

    render() {
        var ongoingErrandText = (this.ongoingErrand) ? "You have one ongoing errand." : "You do not have any ongoing errands.";
        var ongoingErrand = null;
        if (this.ongoingErrand) {
            ongoingErrand = <Errand errand={this.ongoingErrand} navigator={this.navigator} database={this.database}/>
        }
        return (
            <Ons.Page>
                <section className="pageContent">
                    <p>
                        Welcome, {this.user.accName}!
                        <br /> {ongoingErrandText}
                        {ongoingErrand}
                    </p>
                </section>
            </Ons.Page>
        );
    }
}