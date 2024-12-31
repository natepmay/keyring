import { Midi } from "./Midi";

test('frequencyFromNoteNumber', () => {
  expect(Midi.frequencyFromNoteNumber(69 - 12)).toEqual(440 / 2);
  expect(Midi.frequencyFromNoteNumber(69)).toEqual(440);
  expect(Midi.frequencyFromNoteNumber(69 + 12)).toEqual(440 * 2);
});

test('noteNumberFromFrequency', () => {
  expect(Midi.noteNumberFromFrequency(440 / 2)).toEqual(69 - 12);
  expect(Midi.noteNumberFromFrequency(440)).toEqual(69);
  expect(Midi.noteNumberFromFrequency(440 * 2)).toEqual(69 + 12);
});

test('noteNumberFromNoteIdAndOctave', () => {
  expect(Midi.noteNumberFromNoteIdAndOctave(9, 4)).toEqual(69);
  expect(Midi.noteNumberFromNoteIdAndOctave(9, 5)).toEqual(69 + 12);
  expect(Midi.noteNumberFromNoteIdAndOctave(9 + 1, 4)).toEqual(69 + 1);
  expect(Midi.noteNumberFromNoteIdAndOctave(9 + 1, 5)).toEqual(69 + 1 + 12);
});

test('noteIdAndOctaveFromNoteNumber', () => {
  expect(Midi.noteIdAndOctaveFromNoteNumber(69)).toEqual({ noteId: 9, octave: 4 });
  expect(Midi.noteIdAndOctaveFromNoteNumber(69 + 12)).toEqual({ noteId: 9, octave: 5 });
  expect(Midi.noteIdAndOctaveFromNoteNumber(69 - 1)).toEqual({ noteId: 9 - 1, octave: 4 });
  expect(Midi.noteIdAndOctaveFromNoteNumber(69 - 1 + 12)).toEqual({ noteId: 9 - 1, octave: 5 });
});
