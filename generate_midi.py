#!/usr/bin/env python3
"""
Generate a late-90s GeoCities style MIDI soundtrack
Classic upbeat, cheerful, repetitive melody!
"""

from midiutil import MIDIFile

# Create MIDI file with 4 tracks
midi = MIDIFile(4)

# Track 0: Melody (Bright Acoustic Piano)
track = 0
channel = 0
time = 0
tempo = 140  # Upbeat!
midi.addTempo(track, time, tempo)
midi.addProgramChange(track, channel, 0, 1)  # Bright Acoustic Piano

# Track 1: Bass (Electric Bass)
midi.addProgramChange(1, 1, 0, 33)  # Electric Bass (finger)

# Track 2: Chords (Strings)
midi.addProgramChange(2, 2, 0, 48)  # String Ensemble 1

# Track 3: Drums
midi.addProgramChange(3, 9, 0, 0)  # Drum kit on channel 9

# Main melody - catchy and repetitive!
melody = [
    # Bar 1-2: Opening theme
    (60, 0.0, 0.5), (64, 0.5, 0.5), (67, 1.0, 0.5), (72, 1.5, 0.5),
    (67, 2.0, 0.5), (64, 2.5, 0.5), (60, 3.0, 1.0),
    # Bar 3-4: Variation
    (62, 4.0, 0.5), (65, 4.5, 0.5), (69, 5.0, 0.5), (74, 5.5, 0.5),
    (69, 6.0, 0.5), (65, 6.5, 0.5), (62, 7.0, 1.0),
    # Bar 5-6: Return
    (60, 8.0, 0.5), (64, 8.5, 0.5), (67, 9.0, 0.5), (72, 9.5, 0.5),
    (76, 10.0, 0.5), (72, 10.5, 0.5), (67, 11.0, 1.0),
    # Bar 7-8: Ending phrase
    (64, 12.0, 0.5), (67, 12.5, 0.5), (71, 13.0, 0.5), (67, 13.5, 0.5),
    (64, 14.0, 0.5), (60, 14.5, 0.5), (64, 15.0, 1.0),
]

# Add melody
for pitch, start, duration in melody:
    midi.addNote(track, channel, pitch, start, duration, 100)

# Bass line - simple root notes
bass_pattern = [
    (48, 0.0, 1.0), (48, 2.0, 1.0),  # C
    (50, 4.0, 1.0), (50, 6.0, 1.0),  # D
    (48, 8.0, 1.0), (48, 10.0, 1.0), # C
    (53, 12.0, 1.0), (48, 14.0, 2.0), # F -> C
]

for pitch, start, duration in bass_pattern:
    midi.addNote(1, 1, pitch, start, duration, 80)

# Chords - sustained strings
chords = [
    # C major
    ([48, 52, 55, 60], 0.0, 4.0),
    # D minor
    ([50, 53, 57, 62], 4.0, 4.0),
    # C major
    ([48, 52, 55, 60], 8.0, 4.0),
    # F -> C
    ([53, 57, 60, 65], 12.0, 2.0),
    ([48, 52, 55, 60], 14.0, 2.0),
]

for notes, start, duration in chords:
    for note in notes:
        midi.addNote(2, 2, note, start, duration, 60)

# Drums - classic 4/4 beat
for bar in range(4):
    beat_start = bar * 4.0
    # Kick on 1 and 3
    midi.addNote(3, 9, 36, beat_start + 0.0, 0.5, 100)
    midi.addNote(3, 9, 36, beat_start + 2.0, 0.5, 100)
    # Snare on 2 and 4
    midi.addNote(3, 9, 38, beat_start + 1.0, 0.5, 100)
    midi.addNote(3, 9, 38, beat_start + 3.0, 0.5, 100)
    # Hi-hat on every half beat
    for i in range(8):
        midi.addNote(3, 9, 42, beat_start + i * 0.5, 0.25, 70)

# Write to file
with open("public/ddd-theme.mid", "wb") as output_file:
    midi.writeFile(output_file)

print("✅ MIDI file generated: public/ddd-theme.mid")
print("🎵 Late 90s GeoCities vibes incoming!")
