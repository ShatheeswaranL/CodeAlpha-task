import os
import wave
import struct
import math
import random

def generate_track(filename, duration, sample_rate, wave_func):
    """
    Generates a WAV audio track based on a waveform generator function.
    wave_func takes time (seconds) and returns a float between -1.0 and 1.0.
    """
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'w') as w:
        w.setnchannels(1) # mono
        w.setsampwidth(2) # 16-bit
        w.setframerate(sample_rate)
        num_frames = int(duration * sample_rate)
        for i in range(num_frames):
            t = i / sample_rate
            val = wave_func(t)
            # Clamp to prevent clipping
            val = max(-1.0, min(1.0, val))
            # Convert float to 16-bit signed integer (-32768 to 32767)
            int_val = int(val * 32767)
            data = struct.pack('<h', int_val)
            w.writeframesraw(data)
    print(f"Generated: {filename}")

# --- Waveform Helpers ---

def sine(t, freq):
    return math.sin(2 * math.pi * freq * t)

def square(t, freq):
    return 0.4 if (t * freq) % 1.0 < 0.5 else -0.4

def sawtooth(t, freq):
    return 0.3 * (2.0 * ((t * freq) % 1.0) - 1.0)

def noise():
    return random.uniform(-1.0, 1.0)

# --- Genre Generators ---

# 1. Synthwave Breeze
# Features: Driving synth bassline (sawtooth) and a simple retro melody (square)
def synthwave_gen(t):
    # Tempo: 120 BPM -> 0.5s per beat, 0.25s per eighth note
    beat = int(t * 4) # 0.25s steps
    
    # Bassline note progression (sawtooth wave)
    bass_pitches = [110.0, 110.0, 130.81, 146.83, 165.0, 165.0, 146.83, 130.81] # A2, A2, C3, D3, E3, E3, D3, C3
    bass_freq = bass_pitches[(beat // 2) % len(bass_pitches)]
    bass = sawtooth(t, bass_freq)
    
    # Melody progression (square wave)
    melody_pitches = [440.0, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88] # A4, B4, C5, D5, E5, D5, C5, B4
    melody_freq = melody_pitches[(beat // 4) % len(melody_pitches)]
    
    # Simple gate envelope for melody
    t_in_beat = t % 1.0
    envelope = math.exp(-6.0 * (t % 0.5)) if (beat % 2 == 0) else 0
    melody = square(t, melody_freq) * envelope * 0.3
    
    return bass * 0.4 + melody

# 2. Lofi Chill
# Features: Warm chord pads (sine), wow & flutter (pitch modulation), and vinyl crackle
def lofi_gen(t):
    # Wow and flutter (slight frequency modulation at 5Hz)
    lfo = 1.0 + 0.008 * math.sin(2 * math.pi * 5.0 * t)
    
    # Warm chords: Root (146.83 Hz - D3), minor third (174.61 Hz - F3), fifth (220.00 Hz - A3), seventh (261.63 Hz - C4)
    # Slow chord swell
    chord_prog = [
        [146.83, 174.61, 220.00, 261.63], # Dmin7
        [130.81, 164.81, 196.00, 246.94], # Cmaj7
        [116.54, 138.59, 174.61, 207.65], # Bbmin7
        [130.81, 164.81, 196.00, 246.94]  # Cmaj7
    ]
    chord_idx = int(t / 4) % len(chord_prog)
    freqs = chord_prog[chord_idx]
    
    # Combine chord notes
    chords = sum(sine(t * lfo, f) for f in freqs) * 0.18
    
    # Vinyl crackle (dust pops)
    crackle = 0.0
    if random.random() < 0.003: # occasional pop
        crackle = noise() * 0.2
    else:
        crackle = noise() * 0.015 # continuous hiss
        
    return chords + crackle

# 3. Ambient Orbit
# Features: Deep drone, slow swell, and occasional distant space bell
def ambient_gen(t):
    # Deep drone at A1 (55Hz) and A2 (110Hz)
    drone = sine(t, 55.0) * 0.3 + sine(t, 110.0) * 0.2
    
    # Slow dynamic swell (sine at E3 - 164.81Hz) rising and falling every 6 seconds
    swell_env = 0.5 * (1.0 + math.sin(2 * math.pi * (1 / 6.0) * t - math.pi / 2))
    swell = sine(t, 164.81) * swell_env * 0.25
    
    # Space bell: high sine sweeps that decay exponentially, triggered every 4 seconds
    bell = 0.0
    bell_cycle = t % 4.0
    if bell_cycle < 2.0:
        bell_env = math.exp(-3.0 * bell_cycle)
        # Ringing frequencies (bell harmonics)
        bell = (sine(t, 880.0) + 0.5 * sine(t, 1320.0) + 0.25 * sine(t, 1760.0)) * bell_env * 0.15
        
    return drone + swell + bell

# 4. Chiptune Hero
# Features: Fast 8-bit arpeggios (square waves) and pitch slides
def chiptune_gen(t):
    # Fast arpeggios (150 ms per note)
    step = int(t / 0.12)
    
    # Simple retro scales (C major, F major, G major, C major)
    chords = [
        [261.63, 329.63, 392.00, 523.25], # C major
        [349.23, 440.00, 523.25, 698.46], # F major
        [392.00, 493.88, 587.33, 783.99], # G major
        [523.25, 659.25, 783.99, 1046.50] # C major (octave up)
    ]
    chord_idx = int(t / 2) % len(chords)
    current_chord = chords[chord_idx]
    
    # Select note within chord
    note_freq = current_chord[step % len(current_chord)]
    
    # Pitch slide effect (vibrato and slide up)
    vibrato = 1.0 + 0.015 * math.sin(2 * math.pi * 8.0 * t)
    slide = 1.0 + 0.1 * (t % 0.24) # pitch ramps up slightly in short intervals
    
    return square(t * vibrato * slide, note_freq) * 0.25

# 5. Techno Pulse
# Features: Heavy four-on-the-floor kick drum (pitch sweep) and driving sawtooth synth
def techno_gen(t):
    # Kick drum every 0.5 seconds (120 BPM)
    kick_cycle = t % 0.5
    # Exponential pitch drop from 180Hz down to 45Hz
    kick_freq = 45.0 + 135.0 * math.exp(-40.0 * kick_cycle)
    # Volume decay
    kick_env = math.exp(-12.0 * kick_cycle)
    kick = sine(t, kick_freq) * kick_env * 0.6
    
    # Driving bass synth (sawtooth) playing on off-beats
    # plays at 220Hz (A3) or 165Hz (E3)
    synth_cycle = t % 0.25
    synth_env = math.exp(-15.0 * synth_cycle) if (int(t * 8) % 2 == 1) else 0.0 # triggers on offbeats
    synth_freq = 220.0 if (int(t) % 4 < 2) else 165.0
    synth = sawtooth(t, synth_freq) * synth_env * 0.25
    
    # Hi-hat (noise burst) on every off-beat
    hat_cycle = t % 0.5
    hat_env = math.exp(-50.0 * (hat_cycle - 0.25)) if hat_cycle >= 0.25 else 0.0
    hat = noise() * hat_env * 0.06
    
    return kick + synth + hat

# --- Main Generator ---

if __name__ == "__main__":
    sample_rate = 22050  # 22.05 kHz is sufficient for synthesized tones and keeps files small
    duration = 15.0      # 15 seconds per sample is perfect for a web player demo
    
    tracks = [
        ("songs/synthwave_breeze.wav", synthwave_gen),
        ("songs/lofi_chill.wav", lofi_gen),
        ("songs/ambient_orbit.wav", ambient_gen),
        ("songs/chiptune_hero.wav", chiptune_gen),
        ("songs/techno_pulse.wav", techno_gen),
    ]
    
    print("Starting audio synthesis...")
    for path, gen in tracks:
        full_path = os.path.join("C:\\Users\\shath\\.gemini\\antigravity\scratch\\spotify_music_player", path)
        generate_track(full_path, duration, sample_rate, gen)
    print("Audio synthesis complete!")
