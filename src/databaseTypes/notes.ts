// @generated
// Automatically generated. Don't change this file manually.
// Name: notes

export type notesId = number & { " __flavor"?: 'notes' };

export default interface notes {
  /** Primary key. Index: notes_pkey */
  id: notesId;

  created_at: Date | null;

  updated_at: Date | null;

  note_text: string | null;

  for_twitter_id: string | null;
}

export interface notesInitializer {
  /**
   * Default value: nextval('notes_id_seq'::regclass)
   * Primary key. Index: notes_pkey
   */
  id?: notesId;

  /** Default value: now() */
  created_at?: Date | null;

  /** Default value: now() */
  updated_at?: Date | null;

  note_text?: string | null;

  for_twitter_id?: string | null;
}
