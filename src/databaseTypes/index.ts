// @generated
// Automatically generated. Don't change this file manually.
// Name: undefined

import follow_requests, {
  follow_requestsInitializer,
  follow_requestsId,
} from './follow_requests';
import notes, { notesInitializer, notesId } from './notes';
import user_follows, { user_followsInitializer } from './user_follows';
import users, { usersInitializer, usersId } from './users';

type Model = follow_requests | notes | user_follows | users;

interface ModelTypeMap {
  follow_requests: follow_requests;
  notes: notes;
  user_follows: user_follows;
  users: users;
}

type ModelId = follow_requestsId | notesId | usersId;

interface ModelIdTypeMap {
  follow_requests: follow_requestsId;
  notes: notesId;
  users: usersId;
}

type Initializer =
  | follow_requestsInitializer
  | notesInitializer
  | user_followsInitializer
  | usersInitializer;

interface InitializerTypeMap {
  follow_requests: follow_requestsInitializer;
  notes: notesInitializer;
  user_follows: user_followsInitializer;
  users: usersInitializer;
}

export type {
  follow_requests,
  follow_requestsInitializer,
  follow_requestsId,
  notes,
  notesInitializer,
  notesId,
  user_follows,
  user_followsInitializer,
  users,
  usersInitializer,
  usersId,
  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap,
};
