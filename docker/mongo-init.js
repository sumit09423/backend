// MongoDB initialization script
db = db.getSiblingDB('honodb');

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'honodb'
    }
  ]
});

// Create initial collections if needed
db.createCollection('users');

print('✅ MongoDB initialized successfully');
