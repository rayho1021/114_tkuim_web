require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 檢查是否已有管理員，避免重複建立
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('管理員帳號已存在');
      process.exit();
    }

    const admin = new User({
      username: 'admin',
      password: 'adminpassword123' // 這是初始密碼，存入時會自動加密
    });

    await admin.save();
    console.log('管理員帳號初始化成功！');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();