import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class NotificationsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    <p>
                        This section should display notifications received by {this.props.user.name}.
                    </p>
                </section>
            </Ons.Page>
        );
    }
}