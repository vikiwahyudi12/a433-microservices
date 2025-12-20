require('dotenv').config();
const express = require("express");
const app = express();
const amqp = require("amqplib");

// Config RabbitMQ
const amqpServer = process.env.AMQP_URL || 'amqp://localhost';
var channel, connection;

connectToQueue();

async function connectToQueue() {
    try {
        // Connect ke RabbitMQ
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        
        // Pastikan queue 'order' ada
        await channel.assertQueue("order");
        console.log("Shipping service listening...");

        // Consume pesan masuk
        channel.consume("order", data => {
            console.log(`Order received: ${data.content.toString()}`);
            console.log("** Will be shipped soon! **\n");
            
            // Ack biar pesan dihapus dari queue
            channel.ack(data);
        });
    } catch (ex) {
        console.error("RabbitMQ Error:", ex);
    }
}

// Keep container running
app.listen(process.env.PORT || 3001, () => {
    console.log(`Shipping Service running at ${process.env.PORT || 3001}`);
});