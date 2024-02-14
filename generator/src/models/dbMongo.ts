import { create } from 'domain';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

const generations = new Schema({
    title: {
      type: String,
      required: true,
    },
    generationHTML: {
      type: String,
      required: true,
    },
    generationText:  {
      type: String,
      required: true,
    },
    generationTimeStart:  {
      type: Date,
      required: true,
    },
    generationTimeEnd:  {
      type: Date,
      required: true,
    },
    fileSize:  {
      type: Number,
      required: true,
    },
    lineCountBefore:  {
      type: Number,
      required: true,
    },
    lineCountAfter:  {
      type: Number,
      required: true,
    },
    hasText:  {
      type: Boolean,
      required: true,
      default: false,
    },
    usedGenerator:  {
      type: String,
      required: true,
    },
    actualData:  {
      type: Boolean,
      required: true,
      default: false,
    },
    isPublic:  {
      type: Boolean,
      required: true,
      default: false,
    },
});

export const Generations = model('Generations', generations);

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