const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email: 'admin@ssvm-cuttack.org' } });
    if (!user) {
      console.log('ERROR: admin user not found!');
      return;
    }
    console.log('User found:', user.email);
    console.log('Role:', user.role);
    console.log('Password hash length:', user.password.length);
    console.log('Hash prefix:', user.password.substring(0, 7));
    
    const result = await bcrypt.compare('admin123', user.password);
    console.log('bcrypt.compare("admin123") =', result);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
