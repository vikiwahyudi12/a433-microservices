require('dotenv').config();

// Setup express app
const express = require("express");
const app = express();

// Pake body-parser buat parsing JSON body
const bp = require("body-parser");
app.use(bp.json());

// Load library RabbitMQ
const amqp = require("amqplib");

// URL RabbitMQ, ambil dari env atau default localhost
const amqpServer = process.env.AMQP_URL || 'amqp://localhost';

var channel, connection;

// Langsung konek ke queue pas aplikasi jalan
connectToQueue();

async function connectToQueue() {
    try {
        // Bikin koneksi & channel ke RabbitMQ
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        
        // Pastikan queue 'order' ada. Durable true biar queue ga ilang kalo restart
        const queue = "order";
        await channel.assertQueue(queue, { durable: true });
        
        console.log("Connected to the queue!");
    } catch (ex) {
        console.error("Error connecting to RabbitMQ:", ex);
    }
}

// Fungsi buat kirim data ke RabbitMQ
const createOrder = async order => {
    const queue = "order";
    
    // Kirim data ke queue dalam bentuk Buffer string
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    
    console.log("Order succesfully created and sent to queue!");
};

// Endpoint POST /order
app.post("/order", (req, res) => {
    // Ambil data order dari request body
    const { order } = req.body;
    
    // Cek ada datanya apa ngga
    if (!order) {
        return res.status(400).json({ message: "Data order tidak ditemukan" });
    }

    // Kirim ke RabbitMQ
    createOrder(order);
    
    // Balikin response sukses ke client
    res.json({
        message: "Order received",
        data: order
    });
});

// Handle graceful shutdown (misal pas di Ctrl+C) biar koneksi ditutup rapi
process.once('SIGINT', async () => { 
    console.log('got sigint, closing connection');
    if (channel) await channel.close();
    if (connection) await connection.close(); 
    process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});