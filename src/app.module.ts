import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { configDotenv } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';

configDotenv();

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const uri = process.env.MONGO_URI;
        mongoose.connection.on('connected', () => {
          Logger.log('Connected to MongoDB', 'Mongoose', uri);
        });
        mongoose.connection.on('error', (err) => {
          Logger.error(`MongoDB connection error: ${err}`, 'Mongoose');
        });
        return { uri };
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
