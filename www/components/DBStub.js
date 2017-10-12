// just because lol.

import React from 'react';
import ReactDOM from 'react-dom';

export class DBStub extends React.Component {
    constructor(props) {
        super(props);
        this.sampleUsers = [];
        this.sampleErrands = [];

        var sampleBene1 = {
            "userID": 1,
            "accName": "Ben",
            "userType" : "beneficiary",
            "email": "benedict@lighthousesg.com",
            "createdDate": "12 Oct 2017",
            "organization": "None",
            "gender": "Male"
        }
        this.sampleUsers.push(sampleBene1);

        var sampleErrand1 = {
            "beneID": 1,
            "volID": null,
            "status": "listed",
            "title": "House Repainting",
            "description": "my house looks bad ;-;",
            "createdDate": "13 Oct, 2:15pm",
            "tags": "#house #paint",
            "beneRate": null,
            "beneComment": null
        }
        this.sampleErrands.push(sampleErrand1);

        console.log("Database stub initialized");
    }

    getUser(userID) {
        return this.sampleUsers[0];
    }

    getOngoingErrand(userID) {
        return this.sampleErrands[0];
    }
}