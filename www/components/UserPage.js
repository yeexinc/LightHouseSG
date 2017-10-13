import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { Rating } from './utilities/PageUtilities';
import { CompletedErrand } from './utilities/PageUtilities';


export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        this.userID = props.userID;
        this.database = props.database;
        this.navigator = props.navigator;

        if (this.user == null && this.userID) {
            // Get the user from the database
            console.log("Getting user with ID %s from database..." % this.userID);
            this.user = this.database.getUser(this.userID);
        }

        // shouldRenderTB is true when user is vieweing another person's profile (by tapping on links on errand cards)
        // if shouldRenderTB is false, that means the user is viewing their own profile (by accessing it through the bottom tabbar)
        this.shouldRenderTB = props.shouldRenderTB ? props.shouldRenderTB : false;
        this.ownProfile = !this.shouldRenderTB; // for clarity's sake
    }

    renderToolbar() {
        // note: repeated codes from LoginPage.js
        if (this.shouldRenderTB) {
            return (
                <Ons.Toolbar>
                    <div className='left'>
                        <Ons.BackButton>
                            Back
                        </Ons.BackButton>
                    </div>
                    <div className='center'>User</div>
                </Ons.Toolbar>
            );
        }
        else return null;
    }

    render() {
        // Display the log out link if the user is displaying their own page
        var logoutLink = this.shouldRenderTB ? null : <p onClick={this.props.logout} className="logout">Logout</p>;

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
            
        var organization = (this.user.organization) ? <div className="userInfo">
        <h2>Organization</h2>{this.user.organization}</div> : null;
            
        var tags = (this.user.tags) ? <div className="userInfo tags">
        <h2>Associated tags</h2>{this.user.tags}</div> : null;

        var rating = (this.user.rating) ? <Rating rating={this.user.rating} /> : null;

        /////////////////////////// Past errands //////
        var pastErrands = this.user.completedErrands;
        var renderedPastEr = null;

        //<completederrand showInfo={this.ownProfile} userType={this.user.userType}
        if (pastErrands) {
            var pastErrandsAr = [];
            for (var i = 0; i < pastErrands.length; i++) {
                pastErrandsAr.push(
                    <CompletedErrand errand={pastErrands[i]} navigator={this.navigator} database={this.database} ownProfile={this.ownProfile} userType={this.user.userType} />
                )
            }
            renderedPastEr =<div>
                <h2>Past errands</h2>
                {pastErrandsAr}
            </div>;
        }

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <section style={{ margin: '16px' }} className="userPage">
                    <h1>{this.user.accName}</h1>
                    {rating}
                    <h2>{this.user.userType}</h2>
                    <hr></hr>
                    {postalCode}
                    {expertise}
                    {phoneNumber}
                    {organization}
                    {tags}

                    {renderedPastEr}
                    {logoutLink}
                </section>
            </Ons.Page>
        );
    }
}