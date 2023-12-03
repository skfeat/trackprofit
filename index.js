const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const WebSocket = require('ws'); // Import WebSocket library
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });












app.use(express.json());
app.use(cors());
const port = 3002;

// Connection URI
const uri = 'mongodb+srv://skfeat:Raj1775@cluster0.clqoh73.mongodb.net/DataTest';

// Connect to the MongoDB cluster using Mongoose
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB using Mongoose');

    const paymentHistorySchema = new mongoose.Schema({
      date: { type: Date, default: Date.now, required: true },
      amount: { type: Number, required: true },
      status: { type: String,default:"Pending" },
      view: { type: Number, default: 0 },
    });
    const yourSchema = new mongoose.Schema({
      view: { type: Number, default: 0 },
      paymentHistory: [paymentHistorySchema],
    });

    const YourModel = mongoose.model('YourModel', yourSchema);

    app.get('/updateview', async (req, res) => {
        try {
          // Find the document and update the 'view' field by incrementing it by 1
          const updatedDocument = await YourModel.findOneAndUpdate(
            {},
            { $inc: { view: 1 } }, // Increment the 'view' field by 1
            { new: true } // Return the modified document
          );
  
          res.json({ message: 'View updated successfully', updatedDocument });
        } catch (error) {
          console.error('Error updating view:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


//WEBSOCKET CODE 

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  // Send initial data when a client connects
  YourModel.find({}).then((documents) => {
    ws.send(JSON.stringify({ type: 'INITIAL_DATA', data: documents }));
  });

  // Listen for changes and broadcast to connected clients
  const changeStream = YourModel.watch();
  changeStream.on('change', async () => {
    const updatedDocuments = await YourModel.find({});
    ws.send(JSON.stringify({ type: 'UPDATE_DATA', data: updatedDocuments }));
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log('WebSocket disconnected');
    changeStream.close();
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:300`);
});
















      app.get('/putviews/:value', async (req, res) => {
        try {
          const value = req.params.value;
  
          // Find the document and update the 'view' field with the provided value
          const updatedDocument = await YourModel.findOneAndUpdate(
            {},
            { $set: { view: value } }, // Set the 'view' field to the provided value
            { new: true } // Return the modified document
          );
  
          res.json({ message: 'View updated successfully', updatedDocument });
        } catch (error) {
          console.error('Error updating view:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


      app.post('/addpayment', async (req, res) => {
        try {
          const { amount, view } = req.body;
      
          // Validate the request body
          if (!amount) {
            return res.status(400).json({ error: 'Amount is required.' });
          }
      
          // Find or create the document
          const updatedDocument = await YourModel.findOneAndUpdate(
            {},
            {
              $push: {
                paymentHistory: { amount, view }
              }
            },
            { 
              new: true, // Return the modified document
            }
          );
      
          res.json(updatedDocument);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      

      app.put('/updatestatus/:paymentId', async (req, res) => {
        try {
          const { paymentId } = req.params;
          const { status } = req.body;
      
          // Validate the request body
          if (!status) {
            return res.status(400).json({ error: 'Status is required.' });
          }
      
          // Find the document and update the payment status
          const updatedDocument = await YourModel.findOneAndUpdate(
            { 'paymentHistory._id': paymentId },
            {
              $set: {
                'paymentHistory.$.status': status
              }
            },
            { 
              new: true // Return the modified document
            }
          );
      
          if (!updatedDocument) {
            return res.status(404).json({ error: 'Payment not found.' });
          }
      
          res.json(updatedDocument);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      








    app.get('/getdata', async (req, res) => {
      try {
        // Fetch all documents from the database
        const documents = await YourModel.find({});
        
        // Send the documents as a JSON response
        res.json(documents);
      } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB using Mongoose:', error);
  });
