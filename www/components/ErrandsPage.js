import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


export class ErrandsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    <p>
                        Welcome, {this.props.user.name}!
                        <br /> This section should display the list of errands.
                    </p>
                </section>
            </Ons.Page>
        );
    }


}