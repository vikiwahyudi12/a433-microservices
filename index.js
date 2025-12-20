require('dotenv').config();

// Init Express
const express = require("express");
const app = express();

// Body-parser middleware
const bp = require("body-parser");
app.use(bp.json());

// Library RabbitMQ
const amqp = require("amqplib");

// Config RabbitMQ
const amqpServer = process.env.AMQP_URL || 'amqp://localhost';
var channel, connection;

// Langsung konek
connectToQueue();

async function connectToQueue() {
    try {
        // Buat koneksi & channel
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        
        // Pastikan queue 'order' ada
        const queue = "order";
        await channel.assertQueue(queue, { durable: true });
        
        console.log("Terhubung ke queue!");
    } catch (ex) {
        console.error("Error RabbitMQ:", ex);
    }
}

// Helper kirim pesan
const createOrder = async order => {
    const queue = "order";
    // Kirim ke queue sebagai Buffer
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    console.log("Order dikirim ke queue!");
};

// Endpoint POST /order
app.post("/order", (req, res) => {
    // Ambil data
    const { order } = req.body;
    
    // Validasi
    if (!order) {
        return res.status(400).json({ message: "Data order kosong" });
    }

    // Kirim ke RabbitMQ
    createOrder(order);
    
    // Response
    res.json({
        message: "Order diterima",
        data: order
    });
});

// Graceful shutdown
process.once('SIGINT', async () => { 
    console.log('Tutup koneksi...');
    if (channel) await channel.close();
    if (connection) await connection.close(); 
    process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server jalan di port ${PORT}`);
});