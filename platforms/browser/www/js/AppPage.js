import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { LoginPage } from './LoginPage';


// reference: https://github.com/argelius/react-onsenui-redux-weather/tree/master/components

/* The AppPage class returns a OnsenUI Navigator object which initializes the MainPage component.
    The Navigator object is needed to handle page transitions.
*/
export class AppPage extends React.Component {

    constructor() {
        super();
    }

    renderPage(route, navigator) {
        return (
            <route.component key={route.key} navigator={navigator} />
        )
    }

    render() {
        return (
            <Ons.Navigator
                swipeable={true}
                renderPage={this.renderPage.bind(this)}
                initialRoute={{ component: IndexPage, key: 'index-page' }}
            />
        )
    }
}


/* The IndexPage component renders the very first page to be displayed to the user. */
class IndexPage extends React.Component {
    constructor(navigator) {
        super();
        this.navigator = navigator.navigator;
    }

    renderToolbar() {
        return (
            <Ons.Toolbar>
                <div className='center'>LightHouseSG</div>
            </Ons.Toolbar>
        )
    }

    pushLoginPage() {
        // Display the login page
        this.navigator.pushPage({ component: LoginPage, key: 'login-page' });
    }

    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <div className="center">
                    <p>text here</p>
                <Ons.Button onClick={this.pushLoginPage.bind(this)}>
                    Login
                </Ons.Button>
                </div>
            </Ons.Page>
        )
    }
}