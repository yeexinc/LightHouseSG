import React from 'react';
import ReactDOM from 'react-dom';
import Creatable from 'react-select';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { AppPage } from './AppPage';
import { ErrandsPage } from './ErrandsPage';
import { NotificationsPage } from './NotificationsPage';
import { SettingsPage } from './SettingsPage';
import { SearchPage } from './SearchPage';
import { UserPage } from './UserPage';

import { PageToolbar } from './utilities/PageUtilities';

export const volunteerTabs = ['Errands', 'Notifications', 'Search', 'User', 'Settings'];
//export const beneficiaryTabs = ['Errands', 'Add', 'User', 'Settings']
export const beneficiaryTabs = ['Errands', 'User', 'Settings']

export class MainPage extends React.Component {

    constructor(props) {
        super(props);

        //Initialize class variables
        this.navigator = props.navigator;
        this.database = props.database;

        // user is in a form of json object: (refer createMainPage() in LoginPage.)
        this.user = props.user;
        this.tabs = (this.user.userType == 'volunteer') ? volunteerTabs : beneficiaryTabs;

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
                        content: <ErrandsPage user={this.user} key='errands-page' navigator={this.navigator} database={this.database} />,
                        tab: <Ons.Tab label='Errands' icon='fa-home' key='errands-page-key' />
                    });
                    break;
                case 'Notifications':
                    t.push({
                        content: <NotificationsPage user={this.user} database={this.database} navigator={this.navigator} key='notifications-page' />,
                        tab: <Ons.Tab label='Notifications' icon='fa-bell' key='notifications-page-key' />
                    });
                    break;
                case 'Search':
                    t.push({
                        content: <SearchPage user={this.user} key='search-page' navigator={this.navigator} database={this.database} user={this.user} />,
                        tab: <Ons.Tab label='Search' icon='fa-search' key='search-page-key' />
                    });
                    break;
                case 'User':
                    t.push({
                        content: <UserPage user={this.user} navigator={this.navigator}
                            database={this.database} key='user-page' />,
                        tab: <Ons.Tab label='User' icon='fa-user' key='user-page-key' />
                    });
                    break;
                case 'Add':
                    t.push({
                        content: <ErrandsPage user={this.user} key='add-page' />,
                        tab: <Ons.Tab label='New Errand' icon='fa-plus' key='add-page-key' />
                    });
                    break;
                case 'Settings':
                    t.push({
                        content: <SettingsPage user={this.user} logout={this.logout.bind(this)} key='settings-page' />,
                        tab: <Ons.Tab label='Settings' icon='fa-cog' key='settings-page-key' />
                    });
                    break;
                default:
                    t.push({
                        content: <ExamplePage content="An error occurred. Please try again later" key='example-page' />,
                        tab: <Ons.Tab label={null} icon={null} />
                    });
            }
        }
        return t;
    }

    openAddErrandForm() {
        this.navigator.pushPage({ component: this.createAddErrandForm.bind(this), key: 'add-errand-form' });
    }

    createAddErrandForm() {
        return <AddErrandForm navigator={this.navigator} database={this.database}/>
    }

    render() {
        // Display add errand button if user is a beneficiary
        if (this.user) {
            var addErrandButton = this.user.userType == 'beneficiary' ? <Ons.Fab
                style={{
                    backgroundColor: ons.platform.isIOS() ? '#4282cc' : null,
                    margin: '0px 0px 45px 0px'
                }}
                ripple mini
                position='bottom right' onClick={this.openAddErrandForm.bind(this)}>
                <i className="fa fa-plus"></i>
            </Ons.Fab> : null;
        }

        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                {addErrandButton}
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

class AddErrandForm extends React.Component {
    constructor(props) {
        super(props);

        this.database = props.database;
        this.errandTags = [];
        this.tagOptions = [];

        this.state = {
            errandTitle: '',
            description: '',
            tags: []
        }
    }

    componentWillMount() {
        this.errandTags = this.database.getErrandTags();
        console.log(this.errandTags);
        for (var i = 0; i < this.errandTags.length; i++ ) {
            this.tagOptions.push({value: this.errandTags[i], label: '#' + this.errandTags[i]});
        }
    }

    handleTitle(event) {
        this.setState({errandTitle: event.target.value});
        console.log("Title: ", event.target.value);
    }

    handleDescription(event) {
        this.setState({description: event.target.value});
        console.log("Description: ", event.target.value);
    }

    handleTags(value) {
        console.log(value)
        this.setState({tags: value});
    }

    // not complete yet
    handleAddTags(event) {
        if (event.keyCode == 13){
            console.log(event.target.value);
            this.errandTags.push(event.target.value);
            this.tagOptions.push({value: event.target.value, label: '#' + event.target.value});
            this.setState({tags: value});
        }
    }

    handleSubmit() {
        var navigator = this.props.navigator;
        if (this.state.errandTitle != '' && this.state.description != ''){ // && this.state.tags != ''){
            ons.notification.confirm('Are you sure you want to submit this errand?')
            .then((response) => {
                if (response === 1) {
                    console.log("OK!");
                    var title = this.state.errandTitle;
                    var description = this.state.description;
                    var taglist = [];
                    this.state.tags.map((tag) => {
                        taglist.push(tag.value);
                    })
                    console.log(taglist);
                    // DBcontroller ajax call to submit errand to server
                    navigator.popPage();
                }
                else {
                    console.log("CANCEL");
                }
            });
        }
        else {
            ons.notification.alert("Please enter all required Errand information!");
        }

    }
    
    renderToolbar() {
        // note: repeated codes from LoginPage.js
        return (
            <Ons.Toolbar>
                <div className='left'>
                    <Ons.BackButton>
                        Back
                    </Ons.BackButton>
                </div>
                <div className='center'>Submit New Errand</div>
            </Ons.Toolbar>
        );
    }

    renderRow() {
        return (
            <Ons.ListItem>
                <Ons.Input value={this.state.errandName}
                    modifier='underbar'
                    float
                    placeholder='Errand name' />
            </Ons.ListItem>
        )

    }

    // Note: because using pure html is easier to get what I want lmao
    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                <br />
                <ul className="list">
                    <li className="list-item">
                        <div className="list-item__center">
                            <input type="text" className="addErrandInput text-input" placeholder="Title of the errand" 
                                onChange={this.handleTitle.bind(this)} maxLength={50}/>
                        </div>
                    </li>
                </ul>
                <br />
                <ul className="list">
                    <li className="list-item">
                        <div className="list-item__center">
                            <textarea className="addErrandTextarea textarea--transparent" placeholder="Describe what is needed to be done" 
                                onChange={this.handleDescription.bind(this)} maxLength={400}></textarea>
                        </div>
                    </li>
                </ul>

                <br />
                <Creatable
                    name="tag-input"
                    placeholder="Tags (e.g. ride, clean)"
                    value={this.state.tags}
                    options={this.tagOptions}
                    multi={true}
                    onChange={this.handleTags.bind(this)}
                    /* onInputKeyDown={this.handleAddTags.bind(this)} */
                />
                <div className="pageContent center">
                    <Ons.Button onClick={this.handleSubmit.bind(this)}>Submit</Ons.Button>
                </div>
                 
            </Ons.Page>
        )
    }
}