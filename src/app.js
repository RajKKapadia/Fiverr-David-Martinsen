// external packages
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const aq = require('../backend-functions/airtable-queries');

const webApp = express();

// Webapp settings
webApp.use(bodyParser.urlencoded({
    extended: true
}));
webApp.use(bodyParser.json());

const PORT = process.env.PORT;

// Home route
webApp.get('/', (req, res) => {
    res.send(`Hello World.!`);
});

const showUsersByName = async (req, res) => {

    let personName = req['body']['queryResult']['parameters']['person']['name'];

    let userData = await aq.getUserByName(personName);

    let responseText = {}, outputString;

    if (userData['status'] == 1) {

        let names = userData['userNames'];
        let namesString = '';

        for (let i = 0; i < names.length; i++) {
            let name = names[i]['name'];
            let age = names[i]['age'];
            if (i == names.length-1) {
                namesString += name;
                namesString += ` with age ${age}.`;
            } else {
                namesString += name;
                namesString += ` with age ${age}, `;
            }
        };

        let tempUserString;

        if (names.length == 1) {
            tempUserString = 'user';
        } else {
            tempUserString = 'users';
        }

        outputString = `I found the ${tempUserString} ${namesString} If don't find the user you are looking for then try 'get user with age'.`;
    } else {
        outputString = `I did not find the user, please try again with 'get a user' or 'get a user with age'`;
    }

    responseText['fulfillmentText'] = outputString;

    return responseText;
};

const showUserByNameAndAge = async (req, res) => {

    let outputContexts = req['body']['queryResult']['outputContexts'];

    let personName, age;

    outputContexts.forEach(outputContext => {
        let session = outputContext['name'];
        if (session.includes('/contexts/session-vars-guwa')) {
            age = outputContext['parameters']['number'];
            personName = outputContext['parameters']['person']['name'];
        }
    });

    let userData, responseText = {}, outputString;

    if (age !== undefined && personName !== undefined) {
        userData = await aq.getUserByNameAndAge(personName, age);
    } else {

        outputString = 'Something went wrong, try after sometimes.';
        responseText['fulfillmentText'] = outputString;

        return responseText;
    }

    if (userData['status'] == 1) {
        let data = userData['record'];
        outputString = `I found a user ${data['name']} with age ${data['age']}.`;
    } else {
        outputString = `I did not find the user, please try again with 'get a user with age'.`;
    }

    responseText['fulfillmentText'] = outputString;

    return responseText;
};

const showTeamByName = async (req, res) => {

    let outputContexts = req['body']['queryResult']['outputContexts'];

    let teamName;

    outputContexts.forEach(outputContext => {
        let session = outputContext['name'];
        if (session.includes('/contexts/session-vars-gtbn')) {
            teamName = outputContext['parameters']['any'];
        }
    });

    let teamData, responseText = {}, outputString;

    if (teamName !== undefined) {
        teamData = await aq.getTeamByName(teamName);
    } else {

        outputString = 'Something went wrong, try after sometimes.';
        responseText['fulfillmentText'] = outputString;

        return responseText;
    }

    if (teamData['status'] == 1) {
        let data = teamData['record'];
        outputString = `I found a team ${data['teamName']} with id ${data['teamId']}.`;
    } else {
        outputString = `I did not find the team, please try again with 'get a team by name'.`;
    }

    responseText['fulfillmentText'] = outputString;

    return responseText;
};

// Webhook route Google Dialogflow sends the request here
webApp.post('/webhook', async (req, res) => {

    let action = req['body']['queryResult']['action'];

    let responseText;

    if (action === 'getUser') {
        responseText = await showUsersByName(req, res);
    } else if (action === 'getUserWithAge') {
        responseText = await showUserByNameAndAge(req, res);
    } else if (action === 'getTeamByName') {
        responseText = await showTeamByName(req, res);
    }
    else {
        responseText = { 'fulfillmentText': 'Something went wrong, try after sometimes.' };
    }

    res.send(responseText);
});

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});