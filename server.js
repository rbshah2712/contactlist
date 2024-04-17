const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://rsanghvi2712:Raj2712@cluster0.owsw8yh.mongodb.net/';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB database connected'))
  .catch(err => console.error(err));

  // Define your Mongoose model (replace with your data structure)
const ContactSchema = new mongoose.Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: {
        type: String,
        required: true
      },
    phonenumber: {
        type: Number,
        required: true
      },
  });

  const Contact = mongoose.model('Contact', ContactSchema);

  // CRUD API endpoints

// Create
app.post('/contacts', async (req, res) => {
    try {
      const newContact = new Contact(req.body);
      const savedContact = await newContact.save();
      res.json(savedContact);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


  // Read
app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Update
app.put('/contacts/:id', async (req, res) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedContact) {
        return res.status(404).send('Contact not found');
      }
      res.json(updatedContact);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  // Delete
  app.delete('/contacts/:id', async (req, res) => {
    try {
      const deletedContact = await Contact.findByIdAndDelete(req.params.id);
      if (!deletedContact) {
        return res.status(404).send('Contact not found');
      }
      res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  app.listen(port, () => console.log(`Server running on port ${port}`));
  