const axios = require("axios");
const cron = require("node-cron");
const videoDocuments = require('./videoDocuments'); // Import the video documents array

// Replace with your Green API detailsconst apiInstanceId = process.env.API_INSTANCE_ID;const apiInstanceId = process.env.API_INSTANCE_ID;
const apiInstanceId = process.env.API_INSTANCE_ID;
const apiToken = process.env.API_TOKEN;
const groupId = process.env.GROUP_ID;
// const express = require('express');
//const app = express();

// Dummy endpoint to keep server alive
// app.get('/', (req, res) => res.send('Bot is running'));
//
// app.listen(process.env.PORT || 3000, () => {
//     console.log('Server is running...');
// });
const moment = require("moment-timezone");

// Log the current server time
console.log("Server time:", new Date().toISOString());

// Log the current time in various time zones
console.log("Current time in UTC:", moment.utc().format());
console.log(
    "Current time in Asia/Karachi:",
    moment.tz("Asia/Karachi").format()
);

// Array of videos with URLs, scheduled dates, and filenames

// Function to send a document via Green API
const sendDocument = (documentUrl, fileName, type, message) => {
    if (type == "text") {
        const data1 = {
            chatId: groupId,
            message: message
        };

        axios
            .post(
                `https://7103.api.greenapi.com/waInstance${apiInstanceId}/sendMessage/${apiToken}`,
                data1
            )
            .then(response => {
                console.log("Document sent:", response.data);
            })
            .catch(error => {
                console.error("Error sending document:", error);
            });
    } else {
        const data2 = {
            chatId: groupId,
            urlFile: documentUrl,
            fileName: fileName
        };

        axios
            .post(
                `https://7103.api.greenapi.com/waInstance${apiInstanceId}/SendFileByUrl/${apiToken}`,
                data2
            )
            .then(response => {
                console.log("Document sent:", response.data);
            })
            .catch(error => {
                console.error("Error sending document:", error);
            });
    }
};

// Function to schedule document sending
const scheduleDocument = (dateTime, documentUrl, fileName, type, message) => {
    const parsedDateTime = moment(dateTime, "D-M-YYYY h:mm A");
    const cronExpression = `${parsedDateTime.minute()} ${parsedDateTime.hour()} ${parsedDateTime.date()} ${
        parsedDateTime.month() + 1
    } *`;

    console.log(
        `Scheduling for ${dateTime} with cron expression: ${cronExpression}`
    );

    cron.schedule(cronExpression, () => {
        console.log(`Sending document at ${new Date()}...`);
        sendDocument(documentUrl, fileName, type, message);
    });
};

// Schedule each video document
videoDocuments.forEach(video => {
    scheduleDocument(
        video.dateTime,
        video.url,
        video.fileName,
        video.type,
        video.message
    );
});
