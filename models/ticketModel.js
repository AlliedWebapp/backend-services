const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      default: function () {
        const random4Digit = Math.floor(1000 + Math.random() * 9000); // always 4-digit
        return `${random4Digit}`;
      },
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    projectname: {
      type: String,
      required: [true, 'Please select a project'],
      enum: ['Shong', 'Solding', 'Jogini-II', 'JHP Kuwarsi-II', 'SDLLP Salun']
    },
    sitelocation: {
      type: String,
      required: [true, 'Please enter site location']
    },
    projectlocation: {
      type: String,
      required: [true, 'Please enter project location']
    },
    fault: {
      type: String,
      required: [true, 'Please enter fault details']
    },
    issue: {
      type: String,
      required: [true, 'Please enter issue details']
    },
    description: {
      type: String,
      required: [true, 'Please enter a description']
    },
    date: {
      type: Date,
      required: [true, 'Please select a date']
    },
    spare: {
      type: String,
      required: [true, 'Please enter spare details']
    },
    rating: {
      type: String,
      required: [true, 'Please enter DG rating']
    },
    images: [
      {
        data: Buffer,
        contentType: String
      }
    ],
    status: {
      type: String,
      required: true,
      enum: ['new', 'open', 'close'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
)

// Generate 4-digit unique ticket_id before saving
ticketSchema.pre('save', async function (next) {
  try {
    if (!this.ticket_id) {
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        attempts++;
        const randomId = Math.floor(1000 + Math.random() * 9000); // 4-digit

        const existing = await mongoose.models.Ticket.findOne({ ticket_id: `${randomId}` });
        if (!existing) {
          this.ticket_id = `${randomId}`;
          isUnique = true;
        }
      }

      if (!isUnique) {
        throw new Error('Could not generate a unique 4-digit ticket_id');
      }
    }
    next();
  } catch (error) {
    console.error('Error generating ticket_id:', error);
    next(error);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);