/**
 * Script để tạo user admin vào Firebase Realtime Database
 * Chạy: node create_admin.js
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import bcrypt from 'bcryptjs';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASyxDOJ_pGwjBaQqThoYQRmWyq2sq6Eh0",
  authDomain: "report-55c9f.firebaseapp.com",
  databaseURL: "https://report-55c9f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "report-55c9f",
  storageBucket: "report-55c9f.firebasestorage.app",
  messagingSenderId: "104832186162",
  appId: "1:104832186162:web:de2428475f558f78b6c92b",
  measurementId: "G-JLZJWEMVBF"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Admin user - sử dụng UID cố định để dễ quản lý
const ADMIN_UID = 'admin-001';
const adminUser = {
  username: 'admin',
  password: '123456',
  email: 'admin@marketing.com',
  name: 'Administrator',
  role: 'admin',
  id_ns: 'admin001',
  department: 'Admin',
  position: 'Admin',
  team: 'Admin',
  shift: 'Ca Ngày',
  branch: 'Hà Nội'
};

async function createAdmin() {
  console.log('='.repeat(60));
  console.log('👑 Tạo User Admin');
  console.log('='.repeat(60));
  console.log();

  try {
    // Hash mật khẩu
    console.log('🔐 Đang hash mật khẩu...');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminUser.password, salt);

    // Bước 1: Tạo user record trong users
    console.log('📝 Đang tạo admin user trong users...');
    const usersRef = ref(database, `users/${ADMIN_UID}`);
    const userData = {
      username: adminUser.username,
      password: hashedPassword,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      id_ns: adminUser.id_ns,
      department: adminUser.department,
      position: adminUser.position,
      team: adminUser.team,
      shift: adminUser.shift,
      branch: adminUser.branch,
      createdAt: new Date().toISOString(),
      createdBy: 'auto-script'
    };

    await set(usersRef, userData);
    console.log('✅ Đã tạo record trong users');

    // Bước 2: Tạo user record trong human_resources
    console.log('📝 Đang tạo admin user trong human_resources...');
    const hrRef = ref(database, `human_resources/${ADMIN_UID}`);
    const hrData = {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      Ca: adminUser.shift,
      Team: adminUser.team,
      'Thị trường': adminUser.branch,
      'Ngày vào làm': new Date().toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'auto-script'
    };

    await set(hrRef, hrData);
    console.log('✅ Đã tạo record trong human_resources');

    console.log('\n✅ Đã tạo admin user thành công!\n');
    console.log('📋 Thông tin đăng nhập:');
    console.log('-'.repeat(60));
    console.log(`Username: ${adminUser.username}`);
    console.log(`Password: ${adminUser.password}`);
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Name:     ${adminUser.name}`);
    console.log(`Role:     ${adminUser.role}`);
    console.log(`User ID:  ${ADMIN_UID}`);
    console.log('-'.repeat(60));
    console.log('\n⚠️  LƯU Ý: Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu!');

    // Liệt kê tất cả users
    await listAllUsers();
    await listHumanResources();

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }

  process.exit(0);
}

async function listAllUsers() {
  try {
    console.log('\n📋 Danh sách users trong bảng "users":');
    console.log('-'.repeat(100));

    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('ID         | Username       | Name                | Email                          | Role  | Team');
      console.log('-'.repeat(100));

      for (const [userId, userData] of Object.entries(users)) {
        console.log(
          `${userId.substring(0, 10).padEnd(10)} | ${(userData.username || 'N/A').padEnd(14)} | ${(userData.name || 'N/A').padEnd(19)} | ${(userData.email || 'N/A').padEnd(30)} | ${(userData.role || 'user').padEnd(5)} | ${userData.team || 'N/A'}`
        );
      }
      console.log('-'.repeat(100));
      console.log(`Tổng số: ${Object.keys(users).length} users`);
    } else {
      console.log('❌ Không có users nào trong bảng "users"');
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách users:', error.message);
  }
}

async function listHumanResources() {
  try {
    console.log('\n📋 Danh sách users trong bảng "human_resources":');
    console.log('-'.repeat(80));

    const hrRef = ref(database, 'human_resources');
    const snapshot = await get(hrRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('ID         | Name                | Email                          | Role  | Team');
      console.log('-'.repeat(80));

      for (const [userId, userData] of Object.entries(users)) {
        console.log(
          `${userId.substring(0, 10).padEnd(10)} | ${(userData.name || 'N/A').padEnd(19)} | ${(userData.email || 'N/A').padEnd(30)} | ${(userData.role || 'user').padEnd(5)} | ${userData.Team || 'N/A'}`
        );
      }
      console.log('-'.repeat(80));
      console.log(`Tổng số: ${Object.keys(users).length} users`);
    } else {
      console.log('❌ Không có users nào trong bảng "human_resources"');
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách human_resources:', error.message);
  }
}

// Chạy script
createAdmin();
