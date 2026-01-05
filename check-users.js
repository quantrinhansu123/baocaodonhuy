import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Firebase configuration (without analytics)
const firebaseConfig = {
  apiKey: "AIzaSyAsWaXBamChgdkPUyjFOufet9aUfbHNSAw",
  authDomain: "report-fc377.firebaseapp.com",
  databaseURL: "https://report-fc377-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "report-fc377",
  storageBucket: "report-fc377.firebasestorage.app",
  messagingSenderId: "921544399883",
  appId: "1:921544399883:web:6ee83814f62509ee33fb0e",
  measurementId: "G-DDC3SKZD4T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function checkUsers() {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      let count = 0;
      let noPassword = 0;

      for (const [id, user] of Object.entries(users)) {
        count++;
        if (!user.password) {
          console.log(`User ${id} (${user.email}): no password`);
          noPassword++;
        }
      }

      console.log(`Total users: ${count}, Users without password: ${noPassword}`);
    } else {
      console.log('No users found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();