import { musicTheory } from "../../Data/musicTheory";

export class Midi {

  static frequencyFromNoteNumber(noteNumber: number) {
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
  }
  
  static noteNumberFromFrequency(frequency: number) {
    return 33 + (12 * Math.log(frequency / 55)) / Math.log(2);
  }

  static noteNumberFromNoteIdAndOctave(noteId: number, octave: number) {
    return (noteId / musicTheory.octaveDivisions + octave + 1) * 12;
  }

  static noteIdAndOctaveFromNoteNumber(noteNumber: number): {
    noteId: number,
    octave: number,
  } {
    return {
      noteId: noteNumber % 12,
      octave: Math.floor(noteNumber / 12) - 1,
    };
  }

}
