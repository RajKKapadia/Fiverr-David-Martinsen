const axios = require('axios');
require('dotenv').config();

const APP_ID = process.env.APP_ID;
const API_KEY = process.env.API_KEY;

const getUserByName = async (name) => {

    let words = name.split(' ');

    if (words.length < 2) {
        return {
            'status': 0
        };
    }

    let firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    let lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);

    let finalName = firstName.concat(' ', lastName);

    url = `https://api.airtable.com/v0/${APP_ID}/User-Details?view=Grid%20view&filterByFormula=(AND({name}="${finalName}"))`;
    headers = {
        Authorization: 'Bearer ' + API_KEY
    };

    try {
        let response = await axios.get(url, { headers });
        let records = response.data.records;

        if (records.length != 0) {
            
            let userNames = [];

            records.forEach((record) => {
                let temp = {};
                temp['name'] = record.fields.name;
                temp['age'] = record.fields.age;
                userNames.push(temp);
            });

            return {
                'status': 1,
                'length': userNames.length,
                'userNames': userNames
            };
        } else {
            return {
                'status': 0
            };
        }
    } catch (error) {
        console.log(`Error at getUserByName --> ${error}`);
        return {
            'status': 0
        };
    }
};

const getUserByNameAndAge = async (name, age) => {

    let words = name.split(' ');

    if (words.length < 2) {
        return {
            'status': 0
        };
    }

    let firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    let lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);

    let finalName = firstName.concat(' ', lastName);

    url = `https://api.airtable.com/v0/${APP_ID}/User-Details?view=Grid%20view&filterByFormula=(AND({name}="${finalName}", {age}="${age}"))&maxRecords=1`;
    headers = {
        Authorization: 'Bearer ' + API_KEY
    };

    try {
        let response = await axios.get(url, { headers });
        let records = response.data.records;

        if (records.length != 0) {
            return {
                'status': 1,
                'record': records[0]['fields']
            };
        } else {
            return {
                'status': 0
            };
        }

    } catch (error) {
        console.log(`Error at getUserByNameAndAge --> ${error}`);
        return {
            'status': 0
        };
    }
};

const getTeamByName = async (teamName) => {

    let words = teamName.split(' ');

    if (words.length < 2) {
        return {
            'status': 0
        };
    }

    let firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    let lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1);

    let finalName = firstName.concat(' ', lastName);

    url = `https://api.airtable.com/v0/${APP_ID}/Team-Details?view=Grid%20view&filterByFormula=(AND({teamName}="${finalName}"))&maxRecords=1`;
    headers = {
        Authorization: 'Bearer ' + API_KEY
    };

    try {
        let response = await axios.get(url, { headers });
        let records = response.data.records;

        if (records.length != 0) {
            return {
                'status': 1,
                'record': records[0]['fields']
            };
        } else {
            return {
                'status': 0
            };
        }

    } catch (error) {
        console.log(`Error at getUserByNameAndAge --> ${error}`);
        return {
            'status': 0
        };
    }
};


module.exports = {
    getUserByName,
    getUserByNameAndAge,
    getTeamByName
};