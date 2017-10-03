import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class UserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    <p>
                        Display the user page.
                    </p>
                    <p onClick={this.props.logout} className="logout">Logout</p>
                </section>
            </Ons.Page>
        );
    }
}