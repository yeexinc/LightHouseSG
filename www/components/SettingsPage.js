import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showPasswordChangeForm: false
        };
    }

    handleShowChangePassword() {
        this.setState({showPasswordChangeForm: true});
    }

    handleHideChangePassword() {
        this.setState({showPasswordChangeForm: false});
    }

    handleConfirmChangePassword() {
        console.log("here");
        ons.notification.confirm('Are you sure you want to change your password?')
        .then((response) => {
            if (response === 1) {
                console.log("OK!");
                this.handleHideChangePassword();
                ons.notification.alert("Password change confirmed!");
            }
            else {
                console.log("CANCEL");
            }
        });
    }

    renderPasswordChangeOptions() {
        return (
        <div style={{margin: '6px'}}>
            <Ons.Input placeholder="Current Password" modifier="underbar" type="password"></Ons.Input>
            <br />
            <Ons.Input placeholder="New Password" modifier="underbar" type="password"></Ons.Input>
            <br />
            <Ons.Input placeholder="Confirm New Password" modifier="underbar" type="password"></Ons.Input>
            <br />
            <br />
            <Ons.Button style={{margin: '6px', marginLeft: '0px'}} onClick={this.handleHideChangePassword.bind(this)}>Cancel</Ons.Button>
            <Ons.Button style={{margin: '6px'}} onClick={this.handleConfirmChangePassword.bind(this)}>Confirm</Ons.Button>
        </div>
        );
    }

    render() {
        var logoutLink = null;
        var changepassword = null;
        var passwordchangeform = null;
        
        if (this.props.logout) {
            logoutLink = <p onClick={this.props.logout} className="logout">Logout</p>;
        }

        changepassword = <p onClick={this.handleShowChangePassword.bind(this)} className="changepassword">Change Password</p>; 
        if (this.state.showPasswordChangeForm) {
            passwordchangeform = this.renderPasswordChangeOptions();
        }

        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    {changepassword}
                    {passwordchangeform}
                    {logoutLink}
                </section>
            </Ons.Page>
        );
    }


}