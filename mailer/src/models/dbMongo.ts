import { create } from 'domain';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

const mails = new Schema({
    recipients: {
      type: String,
      required: true,
    },
    sentTime: {
      type: Date,
      required: true,
    },
    generationId:  {
      type: String,
      required: true,
      default: "",
    },
});

export const Mails = model('Mails', mails);

export function checkDB() {
  return mongoose.connection.readyState;
}

async function createStore() {
  try{
    //  Connecting to the MongoDB
    await mongoose.connect(uri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
  } catch (err){
    process.exit(1);
  }
}

createStore();