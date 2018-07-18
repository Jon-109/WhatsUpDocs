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
  content: {
    type: Object,
    default: {},
  },
});

var User = mongoose.model('User', userSchema);
var Doc = mongoose.model('Doc', documentSchema)

module.exports = {
  User: User,
  Doc: Doc,
};
