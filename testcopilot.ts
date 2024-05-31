import express from 'express';
import AWS from 'aws-sdk';

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({
    region: 'us-west-2', // Replace with your desired AWS region
    accessKeyId: 'YOUR_ACCESS_KEY_ID', // Replace with your AWS access key ID
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // Replace with your AWS secret access key
});

// Create an instance of the AWS SDK service you want to use
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

// Define your API routes
app.get('/', (req, res) => {
    // Send a message to the SQS queue
    const params = {
        MessageBody: 'Hello from the GET route!',
        QueueUrl: 'YOUR_SQS_QUEUE_URL', // Replace with your SQS queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {  
            console.error('Error sending message to SQS:', err);
            res.status(500).send('Error sending message to SQS');
        } else {
            console.log('Message sent to SQS:', data.MessageId);
            res.send('Hello, world!');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});