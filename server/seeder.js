import User from './models/User.js';
import Grievance from './models/Grievance.js';

const seedData = async () => {
  try {
    const adminExists = await User.findOne({ phoneNumber: '0000000000' });
    if (!adminExists) {
      const adminUser = await User.create({
        name: 'Admin User',
        phoneNumber: '0000000000',
        email: 'admin@e-grievance.gov.in',
        address: 'HQ',
        village: 'Capital',
        password: 'admin',
        role: 'admin',
      });
      console.log('Admin user seeded');
      
      const sampleGrievance = await Grievance.create({
        userId: adminUser._id,
        title: 'Road repair needed',
        description: 'Main road has many potholes.',
        category: 'Road',
        location: 'Village Center',
        status: 'Pending'
      });
      console.log('Sample grievance seeded:', sampleGrievance.grievanceId);
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

export default seedData;
