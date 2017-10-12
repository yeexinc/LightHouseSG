import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { UserPage } from './UserPage';
import { DBController } from './DBController';


export class ErrandsPage extends React.Component {
    constructor(props) {
        super(props);
        this.navigator = props.navigator;
        this.database = props.database;
        this.user = props.user;

        this.ongoingErrand = this.database.getOngoingErrand(1, null);
        if (this.ongoingErrand) {
            this.ongoingBene = this.database.getUser(1, null);
        }
        
    }

    render() {
        var ongoingErrandText = (this.ongoingErrand) ? "You have one ongoing errand." : "You do not have any ongoing errands.";
        var ongoingErrand = null;
        if (this.ongoingErrand) {
            ongoingErrand = <Errand errand={this.ongoingErrand} beneUser={this.ongoingBene} />
        }
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    <p>
                        Welcome, {this.user.name}!
                        <br /> {ongoingErrandText}
                        {ongoingErrand}
                    </p>
                </section>
            </Ons.Page>
        );
    }
}

class Errand extends React.Component {
    // TODO: all props should be refined using interfaces
    constructor(props) {
        super(props);
        this.errand = props.errand;
        this.beneUser = props.beneUser;

        // To create user link
        this.navigator = props.navigator;
    }

    render() {
        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x"></i><h1>{this.errand.title}</h1>
                    <p>{this.errand.description}</p>
                    <p className="postedDate">Posted on {this.errand.postedDate} by <UserLink user={this.beneUser} navigator={this.navigator} /></p>
                    <p className="tags">{this.errand.tags}</p>
                </section>
            </Ons.Card>
        )
    }
}

class UserLink extends React.Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        this.navigator = props.navigator;
    }

    openUserPage() {
        //this.navigator.pushPage({ component: this.createUserPage.bind(this), key: 'login-page-2' });
    }

    createUserPage() {
        return <UserPage shouldRenderTB={true} user={this.user} />
    }

    render() {
        return (
            <a className="userLink" onClick={this.openUserPage.bind(this)}>{this.user.name}</a>
        )
    }
}