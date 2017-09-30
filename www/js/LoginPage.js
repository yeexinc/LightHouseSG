import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { DBController } from './DBController';
import { MainPage } from './MainPage';

export class LoginPage extends React.Component {

    constructor(navigator) {
        super();

        //Initialize class variables
        this.database = new DBController();
        this.navigator = navigator.navigator;
        this.username = '';
        this.password = '';

        this.state = {
            loggingIn: false
        }
    }

    renderToolbar() {
        return (
            <Ons.Toolbar>
                <div className='left'>
                    <Ons.BackButton>
                        Back
                    </Ons.BackButton>
                </div>
                <div className='center'>Login page</div>
            </Ons.Toolbar>
        );
    }

    handleLogin() {
        // TODO: replace this with actual inputs from the fields
        this.setState({ loggingIn: true });// Display the "logging in..." alert

        // Uncomment this to do actual API call to the database
        //var result = this.database.verifyUser("admin", "admin123", this.doLogin);
        
        // Return true for now
        this.doLogin(true);
    }

    doLogin(result) {
        console.log("Verification complete");
        this.setState({ loggingIn: false }); // Hide the alert after verification is done
        if (result) {
            this.navigator.pushPage({ component: MainPage, key: 'main-page' });
        }
        else {
            ons.notification.alert('Your username or password is incorrect. Please try again.');
        }
    }

    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <div className="pageContent center">
                    <Ons.Input placeholder="Username" modifier="underbar"></Ons.Input>
                    <br />
                    <Ons.Input placeholder="Password" modifier="underbar"></Ons.Input>
                    <br /><br />
                    <Ons.Button onClick={this.handleLogin.bind(this)}>Login</Ons.Button>
                </div>

                <Ons.AlertDialog
                    isOpen={this.state.loggingIn}
                    isCancelable={false}>
                    <div className='alert-dialog-title'>Logging in...</div>
                    <div className='alert-dialog-content'>
                        <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
                    </div>
                </Ons.AlertDialog>
            </Ons.Page>
        )
    }
}
