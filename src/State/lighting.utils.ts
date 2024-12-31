import { NoteSet } from "../Utils/Music/NoteSet";
import type { Note } from "../Utils/Music/Note";

export function getLightIdForNote(note: Note): string {
  return `note-${note.id}`;
}

export function getLightIdsForAllNotes(): string[] {
  return NoteSet.chromatic.notes.map(getLightIdForNote);
}
