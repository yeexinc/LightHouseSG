import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { UserPage } from '../UserPage';

/* Shared utilities for different pages */

/* The Errand object to be displayed on the Errands page or Notifications 
page. Since this errand has not yet been completed, it will not be shown 
on any user's page. 

The Errand object only has the user ID and user name (to display links.)
When the link is clicked on, it will create a new UserPage, which will fetch
the associated user object from the database.
*/
export class Errand extends React.Component {
    constructor(props) {
        super(props);
        this.errand = props.errand;
        this.beneID = props.errand.beneID;
        this.beneName = props.errand.beneName;

        this.shouldDisplayVol = false;
        this.onExpand = this.onExpand.bind(this);

        /* If the logged in user is a beneficiary, check if the errand has 
        been taken up by a volunteer. If there is, display status as 
        "Accepted by ___". If there is not, display "Pending" */
        if (props.userType == 'beneficiary') {
            if (props.volID != null && props.volName != null) {
                // Set the flag to display relevant info
                this.shouldDisplayVol = true;
            }
        }

        // To create user link
        this.navigator = props.navigator;
        this.database = props.database;

        var exp = this.props.expanded ? true : false;
        this.state = {
            expanded: exp
        }
    }

    onExpand() {
        this.setState({ expanded: true });
    }

    render() {
        var userLink = this.beneName;
        if (this.navigator != null && this.database != null) {
            if (this.props.userType == 'beneficiary') {
                userLink = <p className="postedDate"><span className="orange">Awaiting response</span></p>;
                if (this.shouldDisplayVol) {
                    userLink = <p className="postedDate"><span className="green">Accepted</span> by <UserLink userID={this.volID} userName={this.volName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}</p>
                }
            }
            else {
                userLink = <p className="postedDate">Submitted by <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}</p>
            }
        }

        var expandButton = null;
        var details = null;
        if (!this.state.expanded) {
            expandButton = <span className="expandBtn" onClick={this.onExpand}>▼ Expand ▼</span>;
            var desc = this.errand.description;
            if (this.errand.description.length > 80) {
                desc = desc.slice(0, 80) + "...";
            }
            details = <div>
                {desc}
                {expandButton}
            </div>;
        }
        else {
            details = <div>
                <p>{this.errand.description}</p>
                <p className="tags">{this.errand.tags}</p>
            </div>;
        }

        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i><h1>{this.errand.title}</h1>
                    {userLink}
                    {details}
                </section>
            </Ons.Card>
        )
    }
}

export class NotifErrand extends Errand {
    constructor(props) {
        super(props);

        // Calculate the expiry time somehow?
        this.expiryTime = "4 hours";

        // For notifs, we need to have accept/reject buttons
        this.responseBtns = <div className="center">
            <span className="respondBtnContainer green" onClick={this.onAcceptBtnClicked.bind(this)}>
                <i className="fa fa-check-circle fa-2x"></i>
                <br />Accept</span>
            <span className="respondBtnContainer red" onClick={this.onRejectBtnClicked.bind(this)}>
                <i className="fa fa-times-circle fa-2x"></i>
                <br />Reject</span>
        </div>;
    }

    onAcceptBtnClicked() {
        this.props.onRespondBtnClicked(true);
    }

    onRejectBtnClicked() {
        this.props.onRespondBtnClicked(false);
    }

    render() {
        var userLink = <p className="postedDate">Submitted by <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}</p>

        var expiryText = null;
        if (this.expiryTime != null) {
            expiryText = <span className="red">This request expires in {this.expiryTime}.</span>
        }

        // For notifs, no expand button needed
        var details = <div>
            <p>{this.errand.description}</p>
            <p className="tags">{this.errand.tags}</p>
        </div>

        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i><h1>{this.errand.title}</h1>
                    {userLink}
                    {details}
                    {expiryText}
                    {this.responseBtns}
                </section>
            </Ons.Card>
        )
    }
}

export class PendingErrand extends NotifErrand {
    constructor(props) {
        super(props);

        // Calculate the expiry time somehow?
        this.expiryTime = "4 hours";
    }

    render() {
        var userLink = <p className="postedDate">Submitted by <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}<br/><span className="orange">Pending</span></p>

        var expiryText = null;
        if (this.expiryTime != null) {
            expiryText = <span className="red">This request expires in {this.expiryTime}.</span>
        }

        // For notifs, no expand button needed
        var details = <div>
            <p>{this.errand.description}</p>
            <p className="tags">{this.errand.tags}</p>
        </div>

        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i><h1>{this.errand.title}</h1>
                    {userLink}
                    {details}
                    {expiryText}
                    {this.responseBtns}
                </section>
            </Ons.Card>
        )
    }

}


/* CompletedErrand objects are displayed on user profiles.
There are several scenarios:
- If the user is viewing their own profile, all information regarding the errand
  can be displayed.
    - If the logged in user is a volunteer, display "Submitted by (beneficiary)"
    - If the logged in user is a beneficiary, display "Completed by (volunteer)"
*/
export class CompletedErrand extends Errand {
    constructor(props) {
        super(props);
        this.volID = props.errand.volID;
        this.volName = props.errand.volName;

        this.ownProfile = props.ownProfile;
        this.userType = props.userType; //userType of logged in user.
    }

    render() {
        var completedBy = null;
        var userLink = null;

        var rating = null;
        var description = null;
        var tags = null;

        if (this.ownProfile) {

            // Show the necesssary information.
            rating = <Rating rating={this.errand.beneRate} />;
            description = <p>{this.errand.description}</p>;
            tags = <p className="tags">{this.errand.tags}</p>;

            if (this.userType == 'volunteer') {
                userLink = <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} />;

                completedBy = <p className="postedDate">Submitted by {userLink} on {this.errand.postedDate}</p>
            }
            else {
                userLink = <UserLink userID={this.volID} userName={this.volName} navigator={this.navigator} database={this.database} />;

                completedBy = <p className="postedDate">Completed by {userLink} on {this.errand.postedDate}</p>
            }
        }
        else {
            // **** TODO: replace this with completedDate
            completedBy = <p className="postedDate">Completed on {this.errand.postedDate}</p>;
        }

        var comment = null;
        if (this.errand.beneComment) {
            comment = <div>
                {rating}
                <b>Beneficiary's comment:</b>
                <br />{this.errand.beneComment}
            </div>
        }
        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i>
                    <h1>{this.errand.title}</h1>
                    {completedBy}
                    {description}
                    {comment}
                </section>
            </Ons.Card>
        )
    }

}

class UserLink extends React.Component {
    constructor(props) {
        super(props);
        this.userID = props.userID;
        this.userName = props.userName;
        this.navigator = props.navigator;
        this.database = props.database;
    }

    openUserPage() {
        this.navigator.pushPage({ component: this.createUserPage.bind(this), key: 'login-page-2' });
    }

    createUserPage() {
        return <UserPage shouldRenderTB={true} userID={this.userID} database={this.database} navigator={this.navigator} />
    }

    render() {
        return (
            <a className="userLink" onClick={this.openUserPage.bind(this)}>{this.userName}</a>
        )
    }
}


export class Rating extends React.Component {
    constructor(props) {
        super(props);
        this.rating = props.rating;
        this.stars = [];

        for (var i = 5; i > Math.floor(this.rating); i--) {
            var key = "star-rating-" + i;
            this.stars.push(<i className="fa fa-star-o" key={key}></i>);
        }
        while (i > 0) {
            var key = "star-rating-" + i;
            this.stars.push(<i className="fa fa-star" key={key}></i>);
            i--;
        }
    }

    render() {
        return (
            <div className="rating">
                {this.stars}
            </div>
        )
    }
}

export class LoadingSection extends React.Component {
    constructor(props) {
        super(props);
        this.text = props.text;
    }

    render() {
        return (
            <section className="loadingSection">
                <i className="fa fa-spinner fa-pulse fa-2x"></i>
                <p>{this.text}</p></section>
        )
    }
}

export class PageToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.hasBackBtn = props.hasBackBtn ? props.hasBackBtn : false;
    }

    render() {
        var backBtn = this.hasBackBtn ? <div className='left'>
            <Ons.BackButton>Back
                        </Ons.BackButton></div> : null;
        return (
            <Ons.Toolbar>
                {backBtn}
                <div className='center'>{this.title}</div>
            </Ons.Toolbar>)
    }
}