import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { Rating, CompletedErrand, LoadingSection, PageToolbar } from './utilities/PageUtilities';


export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        this.userID = props.userID;
        this.database = props.database;
        this.navigator = props.navigator;

        this.onUserLoaded = this.onUserLoaded.bind(this);

        // If there is no user object passed in, we have to load the user from the database later in componentWillMount()
        if (this.user == null) {
            this.state = {
                userLoaded: false,
                showUserInfoEditForm: false,
                changedPhoneNumber: "",
                changedEmail: ""
            }
        }
        else {
            this.state = {
                userLoaded: true,
                showUserInfoEditForm: false,
                changedPhoneNumber: "",
                changedEmail: ""
            }
        }

        // shouldRenderTB is true when user is vieweing another person's profile (by tapping on links on errand cards)
        // if shouldRenderTB is false, that means the user is viewing their own profile (by accessing it through the bottom tabbar)
        this.shouldRenderTB = props.shouldRenderTB ? props.shouldRenderTB : false;
        this.ownProfile = !this.shouldRenderTB; // for clarity's sake
    }

    componentWillMount() {
        if (!this.state.userLoaded) {
            // Get the user from the database
            console.log("Getting user with ID", this.userID, "from database...");
            this.database.getUser(this.userID, this.onUserLoaded);
        }
    }

    // callback function passed to the database to be executed once the AJAX call is successful
    onUserLoaded(result) {
        this.user = result;
        this.setState({ userLoaded: true });
    }

    renderToolbar() {
        if (this.shouldRenderTB) {
            return (<PageToolbar title="User" hasBackBtn={true} />);
        }
        else return null;
    }

    handleShowUserInfoEdit() {
        this.setState({showUserInfoEditForm: true});
    }

    handleHideUserInfoEdit() {
        this.setState({showUserInfoEditForm: false});
    }

    handlePhoneNumberChange(e) {
        this.setState({ changedPhoneNumber: e.target.value });
    }

    handleEmailChange(e) {
        this.setState({ changedEmail: e.target.value });
    }

    handleConfirmUserInfoEdit() {
        ons.notification.confirm('Are you sure you want to edit your info?')
        .then((response) => {
            if (response === 1) {
                console.log("OK!");
                this.user.phoneNumber = this.state.changedPhoneNumber;
                this.user.email = this.state.changedEmail;
                this.handleHideUserInfoEdit();
                ons.notification.alert("User info edit confirmed!");
            }
            else {
                console.log("CANCEL");
            }
        });
    }

    render() {
        // do not render the user page if the user
        // has yet to be fetched from the database
        if (!this.state.userLoaded) {
            return (
                <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                    <LoadingSection text="Loading user..." />
                </Ons.Page>
            );
        }

        // If the user is a volunteer and is viewing their own profile
        var postalCode = null;
        var showPostalCode = (this.user.userType == 'volunteer' && this.ownProfile);
        if (showPostalCode) {
            postalCode =
                <div className="userInfo">
                    <h2>Postal code</h2>
                    {this.user.postalCode}
                </div>;
        }

        // The following codes first check if the attribute exists in the user,
        // and if exists, render it on the user profile
        var expertise = (this.user.expertise) ? <div className="userInfo">
            <h2>Expertise</h2>{this.user.expertise}</div> : null;

        var phoneNumber = (this.user.phoneNumber) ? <div className="userInfo">
            <h2>Phone number</h2>{this.user.phoneNumber}</div> : null;

        var phoneNumberEdit = (this.user.phoneNumber && this.state.showUserInfoEditForm) ? <div>
            <Ons.Input placeholder="New Phone Number" modifier="underbar" onChange={this.handlePhoneNumberChange.bind(this)}></Ons.Input>
            </div> : null;

        var email = (this.user.email) ? <div className="userInfo">
            <h2>Email</h2>{this.user.email}</div> : null;

        var emailEdit = (this.user.email && this.state.showUserInfoEditForm) ? <div>
            <Ons.Input placeholder="New Email" modifier="underbar" onChange={this.handleEmailChange.bind(this)}></Ons.Input>
            </div> : null;

        var organization = (this.user.organization) ? <div className="userInfo">
            <h2>Organization</h2>{this.user.organization}</div> : null;

        var tags = (this.user.tags) ? <div className="userInfo tags">
            <h2>Associated tags</h2>{this.user.tags}</div> : null;

        var rating = (this.ownProfile && this.user.rating) ? <Rating rating={this.user.rating} /> : null;

        /////////////////////////// Past errands //////
        var pastErrands = this.user.completedErrands;
        var renderedPastEr = null;

        //<completederrand showInfo={this.ownProfile} userType={this.user.userType}
        if (pastErrands) {
            var pastErrandsAr = <span className="center"><br/>No past errands could be found.</span>;
            if (pastErrands.length > 0) {
                var pastErrandsAr = [];
                for (var i = 0; i < pastErrands.length; i++) {
                    var pastErrandKey = "past-errand-" + i;
                    pastErrandsAr.push(
                        <CompletedErrand errand={pastErrands[i]} navigator={this.navigator} database={this.database} ownProfile={this.ownProfile} userType={this.user.userType} key={pastErrandKey} />
                    )
                }
            }
            renderedPastEr = <div>
                <h2>Past errands</h2>
                {pastErrandsAr}
            </div>;
        }

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <section style={{ margin: '16px' }} className="userPage">
                    <h1>
                        {this.user.accName}
                        {this.state.showUserInfoEditForm ? <div style={{float: 'right'}}>
                            <Ons.Button style={{marginRight: '6px'}} onClick={this.handleHideUserInfoEdit.bind(this)}><i className="fa fa-times" /> Cancel</Ons.Button>
                            <Ons.Button onClick={this.handleConfirmUserInfoEdit.bind(this)}><i className="fa fa-check" /> Confirm</Ons.Button>
                            </div>: <Ons.Button style={{float: 'right'}} onClick={this.handleShowUserInfoEdit.bind(this)}><i className="fa fa-pencil" /> Edit Info</Ons.Button>}
                    </h1>
                    {rating}
                    <h2>{this.user.userType}</h2>
                    <hr></hr>
                    {postalCode}
                    {expertise}
                    {phoneNumber}
                    {phoneNumberEdit}
                    {phoneNumberEdit ? <div><br /><br /></div> : null}
                    {email}
                    {emailEdit}
                    {emailEdit ? <div><br /><br /></div> : null}
                    {organization}
                    {tags}

                    {renderedPastEr}
                </section>
            </Ons.Page>
        );
    }
}