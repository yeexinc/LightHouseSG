import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { UserPage } from '../UserPage';

/* Shared utilities for different pages */

// An abstract Errand class without any render function
export class Errand extends React.Component {
    constructor(props) {
        super(props);
        this.errand = props.errand;
        this.beneID = props.errand.beneID;
        this.beneName = props.errand.beneName;

        this.onExpand = this.onExpand.bind(this);

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
}

// Errand class with Accept / Reject buttons
export class AccRejErrand extends Errand {
    constructor(props) {
        super(props);

        // Calculate the expiry time somehow?
        this.expiryTime = "24 hours";

        // For notifs, we need to have accept/reject buttons
        this.acceptBtn = <span className="respondBtnContainer green" onClick={this.onAcceptBtnClicked.bind(this)}>
            <i className="fa fa-check-circle fa-2x"></i>
            <br />Accept</span>;
        this.rejectBtn = <span className="respondBtnContainer red" onClick={this.onRejectBtnClicked.bind(this)}>
            <i className="fa fa-times-circle fa-2x"></i>
            <br />Reject</span>;
    }

    onAcceptBtnClicked() {
        ons.notification.confirm('Are you sure you want to accept this request?')
            .then((response) => {
                if (response === 1) {
                    this.props.onRespondBtnClicked(true, this.errand.errID);
                }
                else {
                    console.log("Acceptance cancelled");
                }
            });
    }

    onRejectBtnClicked() {
        ons.notification.confirm('Are you sure you want to reject this errand?')
            .then((response) => {
                if (response === 1) {
                    this.props.onRespondBtnClicked(false, this.errand.errID);
                }
                else {
                    console.log("Rejection cancelled");
                }
            });
    }
}

export class NotifErrand extends AccRejErrand {
    constructor(props) {
        super(props);
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
                    <div className="center">
                        {this.acceptBtn}{this.rejectBtn}
                    </div>
                </section>
            </Ons.Card>
        )
    }
}

export class PendingErrand extends AccRejErrand {
    constructor(props) {
        super(props);
    }

    render() {
        var userLink = <p className="postedDate">Submitted by <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}<br /><span className="orange">Pending</span></p>

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
                    <div className="center">
                        {this.acceptBtn}
                    </div>
                </section>
            </Ons.Card>
        )
    }
}

// Errand where the volunteer has offered to accept the request,
// and is waiting for the beneficiary to accept/reject the offer
export class OfferErrand extends AccRejErrand {
    constructor(props) {
        super(props);
    }

    render() {
        var userLink = this.beneName;
        var showRespondButtons = false;
        var shouldDisplayVol = false;

        if (this.props.userType == 'beneficiary') {
            if (this.props.volID != null && this.props.volName != null) {
                // Set the flag to display relevant info
                shouldDisplayVol = true;
            }
        }

        if (this.navigator != null && this.database != null) {
            if (this.props.userType == 'beneficiary') { // If the logged in user is a beneficiary
                // Display that the errand is waiting for an offer from a volunteer
                if (!shouldDisplayVol) {
                    userLink = <p className="postedDate"><span className="orange">Awaiting response</span></p>;
                }
                else { // If a volunteer has given an offer
                    userLink = <p className="postedDate">
                        <span className="orange">Offered</span> by <UserLink userID={this.props.volID} userName={this.props.volName} navigator={this.navigator} database={this.database} /> on {this.props.updatedDate}</p>;
                    showRespondButtons = true; // Show the accept/reject buttons
                }
            }
            else { // If the user a volunteer,
                userLink = <p className="postedDate">
                    <span className="orange">Awaiting response</span> from <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /></p>;
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

        var buttons = (showRespondButtons) ?
            <div className="center">
                {this.acceptBtn}
                {this.rejectBtn}
            </div> : null;

        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i><h1>{this.errand.title}</h1>
                    {userLink}
                    {details}
                    {buttons}
                </section>
            </Ons.Card>
        )
    }
}

// This is not exactly the same as AccRejErrand but inherited for clarity
export class AcceptedErrand extends AccRejErrand {
    constructor(props) {
        super(props);

        //// Overwrite the parent's accept button
        this.acceptBtn = <Ons.Button onClick={this.openConcludeErrandForm.bind(this)}>
            Conclude errand
        </Ons.Button>
    }

    // Overwrite the function in parent class
    onAcceptBtnClicked(comment, rating) {
        ons.notification.confirm('Are you sure you want to conclude this errand with this comment and rating?')
            .then((response) => {
                if (response === 1) {
                    console.log("Concluding errand with " + comment + ", " + rating);
                    this.props.onRespondBtnClicked(true, this.errand.errID, comment, rating);
                    this.navigator.popPage();
                }
                else {
                    console.log("Cancelled concluding errand");
                }
            });
    }

    openConcludeErrandForm() {
        this.navigator.pushPage({ component: this.createConcludeErrandForm.bind(this), key: 'conclude-errand-form' });
    }

    createConcludeErrandForm() {
        return <ConcludeErrandForm navigator={this.navigator} onConcludeBtnClicked={this.onAcceptBtnClicked.bind(this)} />
    }

    render() {
        var userLink = this.beneName;
        var showConcludeButton = false;

        if (this.props.userType == 'beneficiary') {
            showConcludeButton = true;
        }

        if (this.navigator != null && this.database != null) {
            if (this.props.userType == 'beneficiary') { // If the logged in user is a beneficiary
                userLink = <p className="postedDate">
                    <span className="green">Accepted</span> by <UserLink userID={this.props.volID} userName={this.props.volName} navigator={this.navigator} database={this.database} /> on {this.errand.updatedDate}</p>;
                showConcludeButton = true; // Show the accept/reject buttons
            }
            else { // If the user a volunteer,
                userLink = <p className="postedDate">
                    Submitted by <UserLink userID={this.beneID} userName={this.beneName} navigator={this.navigator} database={this.database} /> on {this.errand.postedDate}</p>;
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

        var concludeButton = (showConcludeButton) ?
            <div className="center">
                {this.acceptBtn}
            </div> : null;

        return (
            <Ons.Card>
                <section className="errandCard">
                    <i className="fa fa-thumb-tack fa-2x tack"></i><h1>{this.errand.title}</h1>
                    {userLink}
                    {details}
                    <br />
                    {concludeButton}
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

                completedBy = <p className="postedDate">Completed by {userLink} on {this.errand.updatedDate}</p>
            }
        }
        else {
            completedBy = <p className="postedDate">Completed on {this.errand.updatedDate}</p>;
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


class ConcludeErrandForm extends React.Component {

    constructor(props) {
        super(props);

        this.onConcludeBtnClicked = props.onConcludeBtnClicked;

        this.state = {
            comment: '',
            rating: 0,
            hoveredRating: 0
        }
    }

    onCommentChange(e) {
        this.setState({ comment: e.target.value });
        console.log("Comment: ", e.target.value);
    }

    onStarClicked(e) {
        this.setState({ rating: e.target.value });
    }

    onStarMouseOver(e) {
        this.setState({ hoveredRating: e.target.value });
    }

    onStarMouseLeave() {
        this.setState({ hoveredRating: 0 });
    }

    onFormSubmit() {
        this.props.onConcludeBtnClicked(this.state.comment, this.state.rating);
    }

    renderToolbar() {
        return <PageToolbar title="Conclude Errand" hasBackBtn={true} />;
    }

    render() {
        var stars = [];
        var rating = (this.state.hoveredRating > 0) ? this.state.hoveredRating : this.state.rating;

        for (var i = 1; i <= rating; i++) {
            var key = "rating-star-" + i;
            stars.push(<button className="fa fa-star fa-2x" onMouseOver={this.onStarMouseOver.bind(this)} onMouseLeave={this.onStarMouseLeave.bind(this)} onClick={this.onStarClicked.bind(this)} value={i} key={key} />);
        }
        var j = rating * 1 + 1;
        while (j <= 5) {
            var key = "rating-star-" + j;
            stars.push(<button className="fa fa-star-o fa-2x" onMouseOver={this.onStarMouseOver.bind(this)} onMouseLeave={this.onStarMouseLeave.bind(this)} onClick={this.onStarClicked.bind(this)} value={j} key={key} />);
            j++;
        }

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <br />
                <ul className="list">
                    <li className="list-item">
                        <div className="list-item__center">
                            <textarea className="addErrandTextarea textarea--transparent" placeholder="Comment on how the errand went."
                                onChange={this.onCommentChange.bind(this)} maxLength={400}></textarea>
                        </div>
                    </li>
                </ul>

                <section className="pageContent">
                    Rate this volunteer:
                    <div className="ratingBtn">
                        {stars}
                    </div>
                    <br />
                    <div className="center">
                        <Ons.Button onClick={this.onFormSubmit.bind(this)}>
                            Conclude errand
                            </Ons.Button>
                    </div>
                </section>
            </Ons.Page>
        )
    }
}

export function currentDateTime() {
    var curTime = new Date();

    var dateStr = curTime.toDateString().split(' '); // e.g. [Wed, Oct, 18, 2017]
    var fullTimeStr = curTime.toTimeString().split(' ')[0]; // e.g. 10:15:25
    var timeStr = fullTimeStr.split(':'); // e.g. [10, 15, 25]

    var formattedDateTime = dateStr[1] + " " + dateStr[2] + ", " + timeStr[0] + ":" + timeStr[1];
    return formattedDateTime;
}