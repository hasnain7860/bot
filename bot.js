const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment');

// Replace with your Green API detailsconst apiInstanceId = process.env.API_INSTANCE_ID;const apiInstanceId = process.env.API_INSTANCE_ID;
const apiInstanceId = process.env.API_INSTANCE_ID;
const apiToken = process.env.API_TOKEN;
const groupId = process.env.GROUP_ID;



// Array of videos with URLs, scheduled dates, and filenames
const videoDocuments = [
  //class 6&7 week 3
  {

    url:"https://drive.google.com/uc?export=download&id=1r2e_pg0bBHg503pH-dzafb9-iL17Ekkt",

    dateTime: '2-7-2024 4:00 AM',
    fileName: "m"
    
  },
    {



    type: "text",

    url: '', // Replace with your Google Drive direct download link
    dateTime: '2-7-2024 4:01 AM',
    fileName: 'm',
    message: "Class 8&9 week 3 day 2 video lecture part 1 "
  },
    {



    url:"https://drive.google.com/uc?export=download&id=1qxjC_mI7JsLPmYoAJh8OIA-0lHf1AIDD",

    dateTime: '2-7-2024 4:02 AM',
    fileName: "m"
    
  
    },
        {





    type: "text",

    url: '', // Replace with your Google Drive direct download link
    dateTime: '2-7-2024 4:03 AM',
    fileName: 'm',
    message: "Class 8&9 week 3 day 2 video lecture part 2"
  },
      {

    url:"https://drive.google.com/uc?export=download&id=1r5QgYhFl5WKjq3WBVGZ9AaisDg-oMoXK",

    dateTime: '2-7-2024 4:04 AM',
    fileName: "m"
    
  },
      {



    type: "text",

    url: '', // Replace with your Google Drive direct download link
    dateTime: '2-7-2024 4:05 AM',
    fileName: 'm',
    message: "Class 8&9 week 3 day 2 work  "
  },
    {

    url:"",

    dateTime: '1-8-2024 12:21 AM',
    fileName: "m"
    
  },
    {

    url:"",

    dateTime: '1-8-2024 12:21 AM',
    fileName: "m"
    
  },
    {

    type: "text",

    url: '', // Replace with your Google Drive direct download link
    dateTime: '1-8-2024 12:47 AM',
    fileName: 'm',
    message: "Class 8&9 week 3 day1  video lecture "
  },
  {
    url:"",
    dateTime: '1-8-2024 12:21 AM',
    fileName: "m"
    
  },

  
  // Add more video objects as needed
];

// Function to send a document via Green API
const sendDocument = (documentUrl, fileName , type , message) => {
  if (type == "text") {
    const data1 = {
    "chatId": groupId,
     "message": message
  };

  axios.post(`https://7103.api.greenapi.com/waInstance${apiInstanceId}/sendMessage/${apiToken}`, data1)
    .then(response => {
      console.log('Document sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending document:', error);
    });
  }else{
  const data2 = {
    "chatId": groupId,
    "urlFile": documentUrl,
    "fileName": fileName
  };

  axios.post(`https://7103.api.greenapi.com/waInstance${apiInstanceId}/SendFileByUrl/${apiToken}`, data2)
    .then(response => {
      console.log('Document sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending document:', error);
    });
  }
};

// Function to schedule document sending
const scheduleDocument = (dateTime, documentUrl, fileName , type, message) => {
  const parsedDateTime = moment(dateTime, 'D-M-YYYY h:mm A');
  const cronExpression = `${parsedDateTime.minute()} ${parsedDateTime.hour()} ${parsedDateTime.date()} ${parsedDateTime.month() + 1} *`;
  
  console.log(`Scheduling for ${dateTime} with cron expression: ${cronExpression}`);
  
  cron.schedule(cronExpression, () => {
    console.log(`Sending document at ${new Date()}...`);
    sendDocument(documentUrl, fileName , type , message);
  });
};

// Schedule each video document
videoDocuments.forEach(video => {
  scheduleDocument(video.dateTime, video.url, video.fileName , video.type , video.message);
});
