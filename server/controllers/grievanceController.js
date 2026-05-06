import Grievance from '../models/Grievance.js';

export const createGrievance = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    
    let priority = 'Low';
    if (category === 'Water' || category === 'Health') {
      priority = 'High';
    } else if (category === 'Electricity' || category === 'Road') {
      priority = 'Medium';
    }

    const grievance = new Grievance({
      userId: req.user._id,
      title,
      description,
      category,
      location,
      priority,
    });

    const createdGrievance = await grievance.save();
    res.status(201).json(createdGrievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ grievanceId: req.params.id }).populate('userId', 'name phoneNumber');
    if (grievance) {
      res.json(grievance);
    } else {
      res.status(404).json({ message: 'Grievance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGrievances = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Ensure standard user can only see their own, but admin can see any
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const grievances = await Grievance.find({ userId }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({}).populate('userId', 'name phoneNumber village').sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGrievanceStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (grievance) {
      grievance.status = status || grievance.status;
      if (remarks) grievance.remarks = remarks;
      
      const updatedGrievance = await grievance.save();
      res.json(updatedGrievance);
    } else {
      res.status(404).json({ message: 'Grievance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upvoteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (grievance) {
      grievance.votes = (grievance.votes || 0) + 1;
      const updatedGrievance = await grievance.save();
      res.json(updatedGrievance);
    } else {
      res.status(404).json({ message: 'Grievance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({}).populate('userId', 'name').sort({ votes: -1, createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
