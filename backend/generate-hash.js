const bcrypt = require('bcryptjs');

const password = 'Password123!';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hash pour Password123!:');
  console.log(hash);
  console.log('\nRequête SQL pour mettre à jour tous les utilisateurs:');
  console.log(`UPDATE users SET password = '${hash}';`);
});
