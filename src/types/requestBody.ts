/* eslint-disable @typescript-eslint/ban-types */
import { DocumentType } from '@typegoose/typegoose';
import { DocumentDefinition } from 'mongoose';
import { Event } from '../models/event.model';

type RecursiveObject<T> = T extends Date
  ? never
  : T extends object | undefined
  ? T
  : never;

type StringValues<TModel> = {
  [Key in keyof TModel]: TModel[Key] extends RecursiveObject<TModel[Key]>
    ? StringValues<TModel[Key]>
    : string;
};

export type RequestBody<T> = Omit<
  StringValues<DocumentDefinition<DocumentType<T>>>,
  '_id' | 'typegooseName'
>;
