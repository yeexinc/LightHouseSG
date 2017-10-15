// just because lol.

import React from 'react';
import ReactDOM from 'react-dom';

export class DBStub extends React.Component {
    constructor(props) {
        super(props);
        this.sampleUsers = [];
        this.sampleErrands = [];
        this.sampleCompletedErrands = [];

        var sampleVol1 = {
            "userID": 1,
            "accName": "a",
            "userType" : "volunteer",
            "email": "aaaa@lighthousesg.com",
            "postalCode" : "12345",
            "phoneNumber": "+6537463777",
            "createdDate": "12 Oct 2017",
            "organization": "Nanyang Technological University",
            "expertise": "cleaning, driving",
            "tags": "#drive #house",
            "gender": "Female",
            "rating": 5.0,
            "completedErrands": []
        }

        var sampleBene1 = {
            "userID": 2,
            "accName": "Ben",
            "userType" : "beneficiary",
            "email": "benedict@lighthousesg.com",
            "postalCode": "03764",
            "phoneNumber": "+658888BBBB",
            "createdDate": "12 Oct 2017",
            "organization": "None",
            "gender": "Male",
            "completedErrands": []
        }

        var sampleBene2 = {
            "userID": 3,
            "accName": "Pikachu",
            "userType" : "beneficiary",
            "email": "gottacatchthemall@lighthousesg.com",
            "postalCode": "22222",
            "phoneNumber": "+65thunderbolt",
            "createdDate": "12 Oct 2017",
            "organization": "None",
            "gender": "Male",
            "completedErrands": []
        }
        this.sampleUsers.push(sampleVol1);
        this.sampleUsers.push(sampleBene1);
        this.sampleUsers.push(sampleBene2);

        var sampleErrand1 = {
            "beneID": 2,
            "beneName": "Ben",
            "volID": null,
            "status": "listed",
            "title": "House Repainting",
            "description": "Part of the exterior of the house has been stained and needs repainting. The tools are already available. Please come any day at around 4.30pm so that I can provide the tools when you arrive.",
            "postedDate": "13 Oct, 2:15pm",
            "tags": "#house #paint",
            "beneRate": null,
            "beneComment": null
        }
        this.sampleErrands.push(sampleErrand1);

        ///////////////////////////////////////////
        var sampleCompletedErrand1 = {
            "beneID": 2,
            "beneName": "Ben",
            "volID": 1,
            "volName": "a",
            "status": "completed",
            "title": "Ride to shop",
            "description": "I'm running out of groceries and in need of transport to the nearest grocery shop in my area. The nearest shop is too far to walk to.",
            "postedDate": "13 Oct, 2:15pm",
            "tags": "#drive #shopping #grocery",
            "beneRate": 5.0,
            "beneComment": "Thank you!"
        }

        var sampleCompletedErrand2 = {
            "beneID": 3,
            "beneName": "Pikachu",
            "volID": 1,
            "volName": "a",
            "status": "completed",
            "title": "Catch the wild Pikachu",
            "description": "I'm playing Pokemon Go and there's no Pikachu near my area. Can someone please give me a ride to catch my all-time favourite Pokemon :( i need it for my life",
            "postedDate": "15 Oct, 2:15pm",
            "tags": "#pokemongo #game #lol",
            "beneRate": 4.0,
            "beneComment": "Got my Pikachu :')))) the ride was bumpy tho"
        }
        this.sampleCompletedErrands.push(sampleCompletedErrand1);
        this.sampleCompletedErrands.push(sampleCompletedErrand2);
        console.log("Database stub initialized");
    }

    getUser(userID) {
        var user = this.sampleUsers[userID - 1];
        user.completedErrands = this.sampleCompletedErrands;
        return user;
    }

    getOngoingErrand(userID) {
        return this.sampleErrands[0];
    }

    getCompletedErrands(userID) {
        return this.sampleCompletedErrands;
    }

    getListedErrands(userID) {
        // for testing, userID is not used
        return this.sampleErrands;
    }
}