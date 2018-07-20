var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

var documentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  collaborators: {
    type: [
      { ref: 'User',
        type: mongoose.Schema.ObjectId,
      }],
  },
  history:{
    type: [
      {
        ref: 'History',
        type: mongoose.Schema.ObjectId,
      }
    ]
  },
  content: {
    type: String,
    default: "",
  },
});

var historySchema = mongoose.Schema({
  docId: {
    type: String,
    required: true,
  },
  saver: {
    type: mongoose.Schema.ObjectId,
    ref:'User'
  },
  content: {
    type: Object,
    default: {},
  },
  time:{
    type: Date,
  },
  HTMLDiff:{
    type: String,
  }
});

var User = mongoose.model('User', userSchema);
var Doc = mongoose.model('Doc', documentSchema)
var History = mongoose.model('History', historySchema);

module.exports = {
  User: User,
  Doc: Doc,
  History: History,
};
