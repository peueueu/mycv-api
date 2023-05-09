import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [UsersModule, ReportsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
