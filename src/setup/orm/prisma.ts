import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient();

/*prismaClient.train.create({data: {
  name: 'er-100',
  tracker: {
    create: {
      serial: '68b18d08-de90-4d51-9031-0b8ed1873dfe'
    }
  }
  }}).then(res => {
    console.log({res})
}).catch((err) => {
  console.log({err})
});*/

export default prismaClient;
