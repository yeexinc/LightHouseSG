import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.user = props.user;
        this.shouldRenderTB = props.shouldRenderTB ? props.shouldRenderTB : false;
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

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <section style={{ margin: '16px' }} className="userPage">
                    <h1>{this.user.name}</h1>
                    <p className="userType">{this.user.type}</p>
                    Display the information about the user here.

                    <li>- Associated tags</li>
                    <li>- Past errands
                    <br/>- Display title
                    <br/>- tapping the errand will expand the card
                    <br/>- Display description + comment</li>

                    {logoutLink}
                </section>
            </Ons.Page>
        );
    }
}