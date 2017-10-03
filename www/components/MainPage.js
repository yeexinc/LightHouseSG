import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { AppPage } from './AppPage';
import { ErrandsPage } from './ErrandsPage';
import { NotificationsPage } from './NotificationsPage';
import { SettingsPage } from './SettingsPage';
import { SearchPage } from './SearchPage';
import { UserPage } from './UserPage';

export const volunteerTabs = ['Errands', 'Notifications', 'Search', 'User', 'Settings'];
export const beneficiaryTabs = ['Errands', 'Add', 'User', 'Settings']

export class MainPage extends React.Component {

    constructor(props) {
        super(props);

        //Initialize class variables
        this.navigator = props.navigator;
        this.user = props.info;
        this.tabs = (this.user.type == 'volunteer') ? volunteerTabs : beneficiaryTabs;

        this.state = {
            index: 0
        }
    }

    logout() {
        this.user = null; // Reset the logged in user info
        this.navigator.resetPage({ component: AppPage, key: 'app-page' });
    }

    renderToolbar() {
        return (
            <Ons.Toolbar>
                <div className='center'>{this.tabs[this.state.index]}</div>
            </Ons.Toolbar>
        );
    }

    renderTabs() {
        var t = [];

        for (var i = 0; i < this.tabs.length; i++) {
            switch (this.tabs[i]) {
                case 'Errands':
                    t.push({
                        content: <ErrandsPage user={this.user} key='errands-page' />,
                        tab: <Ons.Tab label='Errands' icon='fa-home' />
                    });
                    break;
                case 'Notifications':
                    t.push({
                        content: <NotificationsPage user={this.user} key='notifications-page' />,
                        tab: <Ons.Tab label='Notifications' icon='fa-bell' />
                    });
                    break;
                case 'Search':
                    t.push({
                        content: <SearchPage user={this.user} key='search-page' />,
                        tab: <Ons.Tab label='Search' icon='fa-search' />
                    });
                    break;
                case 'User':
                    t.push({
                        content: <UserPage user={this.user} logout={this.logout.bind(this)}
                        key='user-page' />,
                        tab: <Ons.Tab label='User' icon='fa-user' />
                    });
                    break;
                case 'Add':
                    t.push({
                        content: <ErrandsPage user={this.user} key='add-page' />,
                        tab: <Ons.Tab label='New Errand' icon='fa-plus' />
                    });
                    break;
                case 'Settings':
                    t.push({
                        content: <SettingsPage user={this.user} key='settings-page' />,
                        tab: <Ons.Tab label='Settings' icon='fa-cog' />
                    });
                    break;
                default:
                    t.push({
                        content: <ExamplePage content="An error occurred. Please try again later"     key='example-page' />,
                        tab: <Ons.Tab label={null} icon={null} />
                    });
            }
        }
        return t;
    }

    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <Ons.Tabbar swipeable={true} position='auto' index={this.state.index}
                    onPreChange={(event) => {
                        if (event.index != this.state.index) {
                            this.setState({ index: event.index });
                        }
                    }}
                    renderTabs={this.renderTabs.bind(this)}
                />
            </Ons.Page>
        )
    }
}

class ExamplePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    <p>
                        {this.props.content}.
              </p>
                </section>
            </Ons.Page>
        );
    }
}