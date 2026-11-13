const ensureAdminUser = require('./ensureAdmin');

async function seedDatabase() {
  console.log('🧹 Initializing clean database taxonomy (0 sample papers, 0 fake downloads)...');
  await ensureAdminUser();
  console.log('✅ Clean database initialized. Only papers uploaded through the admin panel will appear.');
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}
