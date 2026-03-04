import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Global() // Rend PrismaService disponible partout sans réimporter
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}