import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { PendingErrand, currentDateTime } from './utilities/PageUtilities';

export class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.user = props.user;
        this.database = props.database;
        this.navigator = props.navigator;

        this.onRespondBtnClicked = this.onRespondBtnClicked.bind(this);

        this.errands = this.database.getPendingErrands(0);

        this.state = {
            errandsLoaded: false,
            searchInput: '',
            errandsKey: 0
        }
    }

    onRespondBtnClicked(respond, errID) {
        if (respond, errID) {
            var offeredErrand = this.onErrandAccepted(errID);
            this.database.addNewOffer(offeredErrand);
        }
        else {
            console.log("The pending request has been rejected.");
        }
    }

    onErrandAccepted(errID) {
        for (var i = 0; i < this.errands.length; i++) {
            if (this.errands[i].errID == errID) {
                var x = this.errands[i]; // get the errand
                this.errands.splice(i, 1); // remove the errand from the search list

                // assign information
                x.volID = this.user.userID;
                x.volName = this.user.accName;
                x.status = "offered";
                x.updatedDate = currentDateTime();
                this.setState({ errandsLoaded: true }); // refresh the UI
                return x;
            }
        }
    }

    onSearchInputChanged(e) {
        this.setState({ searchInput: e.target.value });
    }

    filterSearchResults(input) {
        if (input == '') {
            return this.getRenderedErrands(this.errands);
        }

        var searchResultsAr = [];
        for (var i = 0; i < this.errands.length; i++) {
            var x = this.errands[i];
            var searchKey = "search-card-" + i;
            if (this.contains(x.title, input) || this.contains(x.tags, input)) {
                searchResultsAr.push(x);
            }
        }
        var renderedResults = this.getRenderedErrands(searchResultsAr);
        return renderedResults;
    }

    getRenderedErrands(errands) {
        var pendingErrands = [];
        for (var i = 0; i < errands.length; i++) {
            var y = errands[i];
            var searchKey = "search-card-" + this.state.errandsKey;
            this.state.errandsKey++;
            pendingErrands.push(<PendingErrand errand={y} navigator={this.navigator} database={this.database} userType={this.user.userType} onRespondBtnClicked={this.onRespondBtnClicked} key={searchKey} />)
        }
        return pendingErrands;
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