const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

// Connection URI
const uri = 'mongodb+srv://skfeat:Raj1775@cluster0.clqoh73.mongodb.net/Data';

// Connect to the MongoDB cluster using Mongoose
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB using Mongoose');

    // Example: Create a Mongoose model
    const yourSchema = new mongoose.Schema({
      view: { type: Number, default: 0 },
      lastPaid: { type: Number, default: 0 }
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
      app.get('/lastpaid/:value', async (req, res) => {
        try {
          const value = req.params.value;
  
          // Find the document and update the 'view' field with the provided value
          const updatedDocument = await YourModel.findOneAndUpdate(
            {},
            { $set: { lastPaid: value } }, // Set the 'view' field to the provided value
            { new: true } // Return the modified document
          );
  
          res.json({ message: 'View updated successfully', updatedDocument });
        } catch (error) {
          console.error('Error updating view:', error);
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

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB using Mongoose:', error);
  });
