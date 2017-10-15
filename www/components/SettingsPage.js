import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var logoutLink = null;
        if (this.props.logout) {
            logoutLink = <p onClick={this.props.logout} className="logout">Logout</p>;
        }
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    {logoutLink}
                </section>
            </Ons.Page>
        );
    }


}