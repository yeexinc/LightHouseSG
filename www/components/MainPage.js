import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { AppPage } from './AppPage';
import { ErrandsPage } from './ErrandsPage';
import { NotificationsPage } from './NotificationsPage';
import { SettingsPage } from './SettingsPage';
import { SearchPage } from './SearchPage';
import { UserPage } from './UserPage';

import { PageToolbar, currentDateTime } from './utilities/PageUtilities';

export const volunteerTabs = ['Errands', 'Notifications', 'Search', 'User', 'Settings'];
//export const beneficiaryTabs = ['Errands', 'Add', 'User', 'Settings']
export const beneficiaryTabs = ['Errands', 'User', 'Settings']

export class MainPage extends React.Component {

    constructor(props) {
        super(props);

        //Initialize class variables
        this.navigator = props.navigator;
        this.database = props.database;

        this.user = props.user;
        this.tabs = (this.user.userType == 'volunteer') ? volunteerTabs : beneficiaryTabs;

        this.state = {
            index: 0
        }
    }

    logout() {
        this.user = null; // Reset the logged in user info
        this.database.logout();
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
        return <AddErrandForm navigator={this.navigator} database={this.database} user={this.user} />
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
        this.user = props.user;
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
        for (var i = 0; i < this.errandTags.length; i++) {
            this.tagOptions.push({ value: this.errandTags[i], label: '#' + this.errandTags[i] });
        }
    }

    handleTitle(event) {
        this.setState({ errandTitle: event.target.value });
    }

    handleDescription(event) {
        this.setState({ description: event.target.value });
    }

    handleTags(taglist) {
        console.log("taglist: ", taglist);
        for (var i = 0; i < taglist.length; i++){
            if (taglist[i].label.charAt(0) != '#')
                taglist[i].label = '#' + taglist[i].label;
        }
        this.setState({ tags: taglist });
    }

    handleSubmit() {
        var navigator = this.props.navigator;
        if (this.state.errandTitle != '' && this.state.description != '' && this.state.tags != ''){
            ons.notification.confirm('Are you sure you want to submit this errand?')
                .then((response) => {
                    if (response === 1) {
                        console.log("OK!");
                        // DBcontroller ajax call to submit errand to server
                        this.addNewErrand();
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

    addNewErrand() {
        // Do the processing here
        var curTime = currentDateTime();

        var taglist = [];
        this.state.tags.map((tag) => {
            
            // By right if user creates new tag, serverside should integrate it when errand submitted
            // This is required to simulate that locally
            if (!this.errandTags.includes(tag.value)) {
                this.database.appendNewErrandTag(tag.value);
            }
            taglist.push(tag.label);
        })

        // For now let's have the tags as just one string, separated by spaces
        var tagStr = taglist.join(' ');
        console.log(tagStr);

        var newErrand = {
            "errID": 1,
            "beneID": this.user.userID,
            "beneName": this.user.accName,
            "volID": null,
            "status": "listed",
            "title": this.state.errandTitle,
            "description": this.state.description,
            "postedDate": curTime,
            "tags": tagStr,
            "beneRate": null,
            "beneComment": null
        }
        this.database.addNewNotif(newErrand);
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
                                onChange={this.handleTitle.bind(this)} maxLength={50} />
                        </div>
                    </li>
                </ul>
                <br />
                <ul className="list">
                    <li className="list-item">
                        <div className="list-item__center">
                            <textarea className="addErrandTextarea textarea--transparent" placeholder="Describe what is needed to be done"
                                onChange={this.handleDescription.bind(this)} rows="6" maxLength={400}></textarea>
                        </div>
                    </li>
                </ul>

                <br />
                <Select.Creatable
                    name="tag-input"
                    placeholder="Tags (e.g. ride, clean)"
                    value={this.state.tags}
                    options={this.tagOptions}
                    multi={true}
                    onChange={this.handleTags.bind(this)}
                />
                <div className="pageContent center">
                    <Ons.Button onClick={this.handleSubmit.bind(this)}>Submit</Ons.Button>
                </div>

            </Ons.Page>
        )
    }
}