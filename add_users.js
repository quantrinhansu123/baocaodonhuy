/**
 * Script để thêm users vào Firebase Realtime Database với mật khẩu đã hash
 * Chạy: node add_users.js
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import bcrypt from 'bcryptjs';

// Firebase configuration (giống trong src/firebase/config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDjLU2cGWALLCJIVGp_JTKHmRFBJvAtEfw",
  authDomain: "report-867c2.firebaseapp.com",
  databaseURL: "https://report-867c2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "report-867c2",
  storageBucket: "report-867c2.firebasestorage.app",
  messagingSenderId: "527168181858",
  appId: "1:527168181858:web:7c8e0bb04c6b65c5c58b04"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample users (mật khẩu sẽ được hash trước khi lưu)
const sampleUsers = [
  {
    id: 'user1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    name: 'Quản trị viên'
  },
  {
    id: 'user2',
    username: 'marketing',
    password: 'mkt123',
    email: 'marketing@example.com',
    role: 'user',
    name: 'Marketing User'
  },
  {
    id: 'user3',
    username: 'demo',
    password: 'demo123',
    email: 'demo@example.com',
    role: 'user',
    name: 'Demo User'
  },
  {
    id: 'user4',
    username: 'test',
    password: 'test123',
    email: 'test@example.com',
    role: 'user',
    name: 'Test User'
  }
];

async function addUsers() {
  console.log('='.repeat(60));
  console.log('🔐 Firebase Users Management Tool');
  console.log('='.repeat(60));
  console.log();

  try {
    console.log('📝 Đang thêm users vào Firebase với mật khẩu đã hash...');
    
    const salt = bcrypt.genSaltSync(10);
    
    for (const user of sampleUsers) {
      const { id, password, ...userData } = user;
      
      // Hash mật khẩu
      const hashedPassword = bcrypt.hashSync(password, salt);
      
      // Lưu user với password đã hash
      const userRef = ref(database, `users/${id}`);
      await set(userRef, {
        ...userData,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });
      
      console.log(`   ✅ Đã thêm: ${userData.username} (password: ${password} -> hashed)`);
    }

    console.log(`\n✅ Đã thêm ${sampleUsers.length} users vào Firebase!\n`);
    console.log('📋 Thông tin đăng nhập (mật khẩu gốc):');
    console.log('-'.repeat(60));
    console.log('Username         | Password   | Role');
    console.log('-'.repeat(60));
    
    for (const user of sampleUsers) {
      console.log(`${user.username.padEnd(16)} | ${user.password.padEnd(10)} | ${user.role}`);
    }
    console.log('-'.repeat(60));

    // Liệt kê users
    await listUsers();

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }

  process.exit(0);
}

async function listUsers() {
  try {
    console.log('\n📋 Danh sách users trong Firebase:');
    console.log('-'.repeat(80));
    
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('ID         | Username         | Email                          | Role');
      console.log('-'.repeat(80));
      
      for (const [userId, userData] of Object.entries(users)) {
        console.log(
          `${userId.padEnd(10)} | ${userData.username.padEnd(16)} | ${(userData.email || 'N/A').padEnd(30)} | ${userData.role || 'N/A'}`
        );
      }
      console.log('-'.repeat(80));
      console.log(`Tổng số: ${Object.keys(users).length} users`);
    } else {
      console.log('❌ Không có users nào trong database');
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách users:', error.message);
  }
}

// Chạy script
addUsers();
