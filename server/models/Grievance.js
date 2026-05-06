import mongoose from 'mongoose';

const grievanceSchema = mongoose.Schema(
  {
    grievanceId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Others', 'Health'],
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    votes: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique Grievance ID
grievanceSchema.pre('validate', function (next) {
  if (!this.grievanceId) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit number
    this.grievanceId = `GRV-${Date.now().toString().slice(-4)}-${randomNum}`;
  }
  next();
});

const Grievance = mongoose.model('Grievance', grievanceSchema);
export default Grievance;
