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
            password: '',
            userType: ['volunteer', 'beneficiary'],
            selectedUserType: 'volunteer'
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

    // Call to the database and pass in the doLogin() function
    // The DBController will execute the doLogin() function when
    //    the AJAX call is successful.
    handleLogin() {
        // Check if the user has entered a username and a password.
        if (this.state.username == '' || this.state.password == '') {
            ons.notification.alert("Please enter a valid username and password.");
            return;
        }

        // Display the "logging in..." alert
        this.setState({ loggingIn: true });

        // Uncomment this to do actual API call to the database
        //var result = this.database.verifyUser(this.state.username, this.state.password, this.doLogin.bind(this));

        // Comment this out if actual API call is used
        this.doLogin(true, this.navigator);
    }

    // The callback function passed to DBController. If verification is
    // successful, this function renders the main page.
    doLogin(result, navigator) {
        console.log(this.database);
        this.setState({ loggingIn: false }); // Hide the alert after verification is done
        if (result) {
            navigator.pushPage({ component: this.createMainPage.bind(this), key: 'main-page' });
        }
        else {
            ons.notification.alert('Your username or password is incorrect. Please try again.');
        }
    }

    createMainPage() {
        console.log("Creating main page...", this.database);
        var info = {
            name: this.state.username,
            type: this.state.selectedUserType,
            database: this.database
        }
        return <MainPage navigator={this.navigator} info={info} database={this.database}/>;
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleUserTypeChange(value) {
        this.setState({ selectedUserType: value })
    }

    renderLoginOptions(row) {
        return (
            <Ons.ListItem key={row} tappable>
                <label className='left'>
                    <Ons.Radio
                        inputId={`radio-${row}`}
                        checked={row === this.state.selectedUserType}
                        onChange={this.handleUserTypeChange.bind(this, row)}
                    />
                </label>
                <label htmlFor={`radio-${row}`} className='center'>
                    {row}
                </label>
            </Ons.ListItem>
        )
    }

    render() {
        // This variable is just for testing convenience only.
        // Remove this from the render() function before deploying.
        var loginOptions =
            <Ons.List
                dataSource={this.state.userType}
                renderHeader={() => <Ons.ListHeader>Log in as</Ons.ListHeader>}
                renderRow={this.renderLoginOptions.bind(this)}
            />;

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <div className="pageContent center">
                    <Ons.Input placeholder="Username" modifier="underbar" onChange={this.handleUsernameChange.bind(this)}></Ons.Input>
                    <br />
                    <Ons.Input placeholder="Password" modifier="underbar" onChange={this.handlePasswordChange.bind(this)} type="password"></Ons.Input>
                    <br />
                    {loginOptions}
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
