import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { DBController } from './DBController';
import { MainPage } from './MainPage';

export class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        //Initialize class variables
        this.navigator = props.navigator;
        this.database = new DBController(this.navigator);

        this.state = {
            loggingIn: false,
            username: '',
            password: ''
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
        // Check if the user has entered a username and a password.
        if (this.state.username == '' || this.state.password == '') {
            ons.notification.alert("Please enter a valid username and password.");
            return;
        }

        this.setState({ loggingIn: true });// Display the "logging in..." alert

        // Uncomment this to do actual API call to the database
        //var result = this.database.verifyUser("admin", "admin123", this.doLogin);

        // Comment this out if actual API call is used
        this.doLogin(true, this.navigator);
    }

    doLogin(result, navigator) {
        console.log("Verification complete");
        console.log(result);
        this.setState({ loggingIn: false }); // Hide the alert after verification is done
        if (result) {
            navigator.pushPage({ component: this.createMainPage.bind(this), key: 'main-page' });
        }
        else {
            ons.notification.alert('Your username or password is incorrect. Please try again.');
        }
    }

    createMainPage() {
        //TODO: replace the info with actual log in user info
        var info = {
            name: this.state.username,
            type: "volunteer"
        }
        return <MainPage navigator={this.navigator} info={info} />;
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <div className="pageContent center">
                    <Ons.Input placeholder="Username" modifier="underbar" onChange={this.handleUsernameChange.bind(this)}></Ons.Input>
                    <br />
                    <Ons.Input placeholder="Password" modifier="underbar" onChange={this.handlePasswordChange.bind(this)}></Ons.Input>
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
