const mongoose = require('mongoose');
const Admin = require('./models/admin');

const MONGO_URI = 'mongodb+srv://zwelishasiwela2:X8IB42VlqWJBwkxh@cluster0.insd61y.mongodb.net/car_rental';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: 'zwelishat@gmail.com' });

    if (!existing) {
      const admin = new Admin({
        name: 'Zwelisha Siwela',
        email: 'zwelishat@gmail.com',
        password: 'P@ssword1', // will be hashed automatically
      });

      await admin.save();
      console.log('🎉 Admin account created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    mongoose.disconnect();
  })
  .catch(err => console.error('❌ MongoDB error:', err));
