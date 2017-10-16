import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { PendingErrand } from './utilities/PageUtilities';

export class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.user = props.user;
        this.database = props.database;
        this.navigator = props.navigator;

        this.errands = this.database.getPendingErrands(0);
        this.pendingErrands = [];
        for (var i = 0; i < this.errands.length; i++) {
            var y = this.errands[i];
            var searchKey = "search-card-" + i;
            this.pendingErrands.push(<PendingErrand errand={y} navigator={this.navigator} database={this.database} userType={this.user.userType} onRespondBtnClicked={this.onRespondBtnClicked} key={searchKey} />)
        }

        this.state = {
            errandsLoaded: false,
            searchInput: ''
        }
    }

    onRespondBtnClicked(respond) {
        if (respond) {
            console.log("The pending request has been accepted.");
        }
        else {
            console.log("The pending request has been rejected.");
        }
    }

    onSearchInputChanged(e) {
        this.setState({ searchInput: e.target.value });
    }

    filterSearchResults(input) {
        if (input == '') {
            return this.pendingErrands;
        }

        var searchResultAr = [];

        // Filter the search results here
        for (var i = 0; i < this.errands.length; i++) {
            var x = this.errands[i];
            var searchKey = "search-card-" + i;
            if (this.contains(x.title, input) || this.contains(x.tags, input)) {
                searchResultAr.push(<PendingErrand errand={x} navigator={this.navigator} database={this.database} userType={this.user.userType} onRespondBtnClicked={this.onRespondBtnClicked} key={searchKey} />)
            }
        }
        return searchResultAr;
    }

    contains(string1, string2) {
        var x1 = string1.toString().toLowerCase();
        var x2 = string2.toString().toLowerCase();
        return (x1.indexOf(x2) != -1);
    }

    render() {
        var searchResults = this.filterSearchResults(this.state.searchInput);
        if (searchResults.length <= 0) {
            searchResults = <p className="center"><br />No errands matching your search could be found.</p>;
        }
        return (
            <Ons.Page>
                <section className="pageContent">
                    <div className="center"><Ons.SearchInput placeholder='Search for errands...' onChange={this.onSearchInputChanged.bind(this)} /></div>

                    {searchResults}
                </section>
            </Ons.Page>
        );
    }


}