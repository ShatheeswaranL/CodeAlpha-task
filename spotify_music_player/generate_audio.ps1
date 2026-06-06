$source = @"
using System;
using System.IO;

public class WavGenerator {
    private static void GenerateTrack(string filename, double duration, int sampleRate, Func<double, double> waveFunc) {
        string dir = Path.GetDirectoryName(filename);
        if (!Directory.Exists(dir)) {
            Directory.CreateDirectory(dir);
        }
        
        using (FileStream fs = new FileStream(filename, FileMode.Create)) {
            using (BinaryWriter bw = new BinaryWriter(fs)) {
                int numSamples = (int)(duration * sampleRate);
                int numChannels = 1;
                int bitsPerSample = 16;
                int byteRate = sampleRate * numChannels * bitsPerSample / 8;
                int blockAlign = numChannels * bitsPerSample / 8;
                int subChunk2Size = numSamples * numChannels * bitsPerSample / 8;
                int chunkSize = 36 + subChunk2Size;

                // RIFF header
                bw.Write(new char[] { 'R', 'I', 'F', 'F' });
                bw.Write(chunkSize);
                bw.Write(new char[] { 'W', 'A', 'V', 'E' });

                // fmt chunk
                bw.Write(new char[] { 'f', 'm', 't', ' ' });
                bw.Write(16); // subchunk1size
                bw.Write((short)1); // PCM format
                bw.Write((short)numChannels);
                bw.Write(sampleRate);
                bw.Write(byteRate);
                bw.Write((short)blockAlign);
                bw.Write((short)bitsPerSample);

                // data chunk
                bw.Write(new char[] { 'd', 'a', 't', 'a' });
                bw.Write(subChunk2Size);

                for (int i = 0; i < numSamples; i++) {
                    double t = (double)i / sampleRate;
                    double val = waveFunc(t);
                    val = Math.Max(-1.0, Math.Min(1.0, val));
                    short intVal = (short)(val * 32767.0);
                    bw.Write(intVal);
                }
            }
        }
        Console.WriteLine("Generated WAV: " + filename);
    }

    public static void GenerateAll(string baseDir) {
        int sampleRate = 22050;
        double duration = 15.0;

        // 1. Synthwave Breeze
        GenerateTrack(Path.Combine(baseDir, "songs/synthwave_breeze.wav"), duration, sampleRate, t => {
            int beat = (int)(t * 4.0);
            double[] bassPitches = { 110.0, 110.0, 130.81, 146.83, 165.0, 165.0, 146.83, 130.81 };
            double bassFreq = bassPitches[(beat / 2) % bassPitches.Length];
            double bass = 0.3 * (2.0 * ((t * bassFreq) % 1.0) - 1.0); // sawtooth

            double[] melodyPitches = { 440.0, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88 };
            double melodyFreq = melodyPitches[(beat / 4) % melodyPitches.Length];
            double envelope = (beat % 2 == 0) ? Math.Exp(-6.0 * (t % 0.5)) : 0.0;
            double melody = ((t * melodyFreq) % 1.0 < 0.5 ? 0.4 : -0.4) * envelope * 0.3; // square

            return bass * 0.4 + melody;
        });

        // 2. Lofi Chill
        Random rand = new Random();
        GenerateTrack(Path.Combine(baseDir, "songs/lofi_chill.wav"), duration, sampleRate, t => {
            double lfo = 1.0 + 0.008 * Math.Sin(2 * Math.PI * 5.0 * t);
            double[][] chordProg = {
                new double[] { 146.83, 174.61, 220.00, 261.63 }, // Dmin7
                new double[] { 130.81, 164.81, 196.00, 246.94 }, // Cmaj7
                new double[] { 116.54, 138.59, 174.61, 207.65 }, // Bbmin7
                new double[] { 130.81, 164.81, 196.00, 246.94 }  // Cmaj7
            };
            int chordIdx = (int)(t / 4.0) % chordProg.Length;
            double[] freqs = chordProg[chordIdx];
            double chords = 0.0;
            foreach (double f in freqs) {
                chords += Math.Sin(2.0 * Math.PI * f * t * lfo);
            }
            chords *= 0.18;
            double crackle = (rand.NextDouble() < 0.003) ? (rand.NextDouble() * 2.0 - 1.0) * 0.2 : (rand.NextDouble() * 2.0 - 1.0) * 0.015;
            return chords + crackle;
        });

        // 3. Ambient Orbit
        GenerateTrack(Path.Combine(baseDir, "songs/ambient_orbit.wav"), duration, sampleRate, t => {
            double drone = Math.Sin(2.0 * Math.PI * 55.0 * t) * 0.3 + Math.Sin(2.0 * Math.PI * 110.0 * t) * 0.2;
            double swellEnv = 0.5 * (1.0 + Math.Sin(2.0 * Math.PI * (1.0 / 6.0) * t - Math.PI / 2.0));
            double swell = Math.Sin(2.0 * Math.PI * 164.81 * t) * swellEnv * 0.25;
            
            double bell = 0.0;
            double bellCycle = t % 4.0;
            if (bellCycle < 2.0) {
                double bellEnv = Math.Exp(-3.0 * bellCycle);
                bell = (Math.Sin(2.0 * Math.PI * 880.0 * t) + 0.5 * Math.Sin(2.0 * Math.PI * 1320.0 * t) + 0.25 * Math.Sin(2.0 * Math.PI * 1760.0 * t)) * bellEnv * 0.15;
            }
            return drone + swell + bell;
        });

        // 4. Chiptune Hero
        GenerateTrack(Path.Combine(baseDir, "songs/chiptune_hero.wav"), duration, sampleRate, t => {
            int step = (int)(t / 0.12);
            double[][] chords = {
                new double[] { 261.63, 329.63, 392.00, 523.25 }, // C major
                new double[] { 349.23, 440.00, 523.25, 698.46 }, // F major
                new double[] { 392.00, 493.88, 587.33, 783.99 }, // G major
                new double[] { 523.25, 659.25, 783.99, 1046.50 } // C major (octave up)
            };
            int chordIdx = (int)(t / 2.0) % chords.Length;
            double[] currentChord = chords[chordIdx];
            double noteFreq = currentChord[step % currentChord.Length];
            double vibrato = 1.0 + 0.015 * Math.Sin(2.0 * Math.PI * 8.0 * t);
            double slide = 1.0 + 0.1 * (t % 0.24);
            double freq = noteFreq * vibrato * slide;
            return ((t * freq) % 1.0 < 0.5 ? 0.4 : -0.4) * 0.25;
        });

        // 5. Techno Pulse
        GenerateTrack(Path.Combine(baseDir, "songs/techno_pulse.wav"), duration, sampleRate, t => {
            double kickCycle = t % 0.5;
            double kickFreq = 45.0 + 135.0 * Math.Exp(-40.0 * kickCycle);
            double kickEnv = Math.Exp(-12.0 * kickCycle);
            double kick = Math.Sin(2.0 * Math.PI * kickFreq * t) * kickEnv * 0.6;

            double synthCycle = t % 0.25;
            double synthEnv = ((int)(t * 8.0) % 2 == 1) ? Math.Exp(-15.0 * synthCycle) : 0.0;
            double synthFreq = ((int)t % 4 < 2) ? 220.0 : 165.0;
            double synth = 0.3 * (2.0 * ((t * synthFreq) % 1.0) - 1.0) * synthEnv * 0.25;

            double hatCycle = t % 0.5;
            double hatEnv = (hatCycle >= 0.25) ? Math.Exp(-50.0 * (hatCycle - 0.25)) : 0.0;
            double hat = (rand.NextDouble() * 2.0 - 1.0) * hatEnv * 0.06;

            return kick + synth + hat;
        });

        // 6. Pavala Malli (Acoustic / Plucked Folk)
        GenerateTrack(Path.Combine(baseDir, "songs/pavala_malli.wav"), duration, sampleRate, t => {
            int beat = (int)(t * 3.0);
            double[] scale = { 329.63, 415.30, 440.00, 493.88 }; // E4, G#4, A4, B4
            double freq = scale[beat % scale.Length];
            double envelope = Math.Exp(-4.0 * (t % 0.33));
            double pluck = Math.Sin(2.0 * Math.PI * freq * t) * envelope;
            double drone = Math.Sin(2.0 * Math.PI * 164.81 * t) * 0.15; // Soft E3 drone
            return pluck * 0.35 + drone;
        });

        // 7. Chaudhary (Rajasthani Folk)
        GenerateTrack(Path.Combine(baseDir, "songs/chaudhary.wav"), duration, sampleRate, t => {
            double cycle = t % 0.6;
            double drum = 0.0;
            if (cycle < 0.15) drum = Math.Sin(2.0 * Math.PI * (80.0 + 80.0 * Math.Exp(-30.0 * cycle)) * t) * Math.Exp(-15.0 * cycle) * 0.5;
            if (cycle >= 0.3 && cycle < 0.45) drum += Math.Sin(2.0 * Math.PI * (120.0 * Math.Exp(-30.0 * (cycle - 0.3))) * t) * Math.Exp(-15.0 * (cycle - 0.3)) * 0.3;
            double sweepFreq = 440.0 + 100.0 * Math.Sin(2.0 * Math.PI * 1.5 * t); // sliding vocal synth
            double melody = Math.Sin(2.0 * Math.PI * sweepFreq * t) * 0.15;
            return drum + melody;
        });

        // 8. Aalaporaan Tamilan (Fanfare / Thavil Drums)
        GenerateTrack(Path.Combine(baseDir, "songs/aalaporaan_tamilan.wav"), duration, sampleRate, t => {
            double cycle = t % 0.8;
            double thavil = Math.Sin(2.0 * Math.PI * (50.0 + 50.0 * Math.Exp(-20.0 * cycle)) * t) * Math.Exp(-8.0 * cycle) * 0.6;
            int phrase = (int)(t / 1.6) % 4;
            double[] fanfareFreqs = { 587.33, 659.25, 523.25, 440.0 }; // D5, E5, C5, A4
            double freq = fanfareFreqs[phrase];
            double gate = (t % 0.4 < 0.3) ? 1.0 : 0.0;
            double trumpet = (Math.Sin(2.0 * Math.PI * freq * t) + 0.5 * Math.Sin(2.0 * Math.PI * freq * 2.0 * t)) * gate * 0.15;
            return thavil + trumpet;
        });

        // 9. Enjoy Enjaami (Tribal Rap / Wood Blocks)
        GenerateTrack(Path.Combine(baseDir, "songs/enjoy_enjaami.wav"), duration, sampleRate, t => {
            double tickCycle = t % 0.25;
            double tickEnv = Math.Exp(-80.0 * tickCycle);
            double tickFreq = (int)(t * 4.0) % 2 == 0 ? 1200.0 : 800.0;
            double click = Math.Sin(2.0 * Math.PI * tickFreq * t) * tickEnv * 0.15;
            
            int step = (int)(t / 0.5) % 8;
            double[] bassNotes = { 69.3, 69.3, 0, 92.5, 92.5, 0, 82.4, 69.3 }; // C#2, F#2, E2 groove
            double bassFreq = bassNotes[step];
            double bass = (bassFreq > 0) ? Math.Sin(2.0 * Math.PI * bassFreq * t) * 0.35 : 0.0;
            
            double melody = 0.0;
            if (step % 2 == 0) {
                double melFreq = 277.18; // C#4
                melody = Math.Sin(2.0 * Math.PI * melFreq * t) * 0.15 * Math.Exp(-12.0 * (t % 0.25));
            }
            
            return bass + click + melody;
        });

        // 10. Blinding Lights (80s Synthpop Hook)
        GenerateTrack(Path.Combine(baseDir, "songs/blinding_lights.wav"), duration, sampleRate, t => {
            double cycle = t % 0.35;
            double kick = Math.Sin(2.0 * Math.PI * (120.0 * Math.Exp(-35.0 * cycle)) * t) * Math.Exp(-10.0 * cycle) * 0.4;
            
            double bassCycle = t % 0.175;
            double bassFreq = (int)(t / 1.4) % 2 == 0 ? 116.54 : 98.0; // Bb2 / G2
            double bass = 0.2 * (2.0 * ((t * bassFreq) % 1.0) - 1.0) * Math.Exp(-8.0 * bassCycle) * 0.25;

            double[] hookNotes = { 349.23, 349.23, 392.00, 440.00, 349.23, 523.25, 440.00, 392.00 }; // F4, F4, G4, A4, F4, C5, A4, G4
            int noteIdx = (int)(t / 0.35) % hookNotes.Length;
            double melodyFreq = hookNotes[noteIdx];
            double melEnv = Math.Exp(-5.0 * (t % 0.35));
            double melody = 0.3 * (2.0 * ((t * melodyFreq) % 1.0) - 1.0) * melEnv * 0.2; // Sawtooth

            return kick + bass + melody;
        });

        // 11. Shape of You (Marimba-Pop)
        GenerateTrack(Path.Combine(baseDir, "songs/shape_of_you.wav"), duration, sampleRate, t => {
            int step = (int)(t / 0.25);
            // C# minor groove: C#3 (138Hz) -> F#3 (165Hz) -> A3 (220Hz) -> B3 (246Hz)
            double[] marimbaPitches = { 277.18, 329.63, 440.00, 392.00 };
            double freq = marimbaPitches[step % marimbaPitches.Length];
            double env = Math.Exp(-20.0 * (t % 0.25));
            double pluck = Math.Sin(2.0 * Math.PI * freq * t) * env * 0.45;
            
            // Soft percussion kick beat
            double kickCycle = t % 0.5;
            double kick = Math.Sin(2.0 * Math.PI * (100.0 * Math.Exp(-30.0 * kickCycle)) * t) * Math.Exp(-12.0 * kickCycle) * 0.25;
            
            return pluck + kick;
        });

        // 12. Kabira (Sufi Acoustic)
        GenerateTrack(Path.Combine(baseDir, "songs/kabira.wav"), duration, sampleRate, t => {
            // Soft acoustic guitar chords arpeggiation (E major)
            int step = (int)(t / 0.15);
            double[] arpeggio = { 164.81, 246.94, 329.63, 415.30, 493.88, 415.30, 329.63, 246.94 };
            double guitarFreq = arpeggio[step % arpeggio.Length];
            double guitarEnv = Math.Exp(-8.0 * (t % 0.15));
            double guitar = Math.Sin(2.0 * Math.PI * guitarFreq * t) * guitarEnv * 0.3;

            // Flute-like high melody
            double sweepFreq = 659.25 + 10.0 * Math.Sin(2.0 * Math.PI * 2.0 * t);
            double flute = Math.Sin(2.0 * Math.PI * sweepFreq * t) * 0.08 * (0.8 + 0.2 * Math.Sin(2.0 * Math.PI * 0.2 * t));
            
            return guitar + flute;
        });

        // 13. Rowdy Baby (Energetic Tamil Koothu)
        GenerateTrack(Path.Combine(baseDir, "songs/rowdy_baby.wav"), duration, sampleRate, t => {
            // Fast dappan-koothu beats at 160 BPM (0.18s eighth notes)
            double cycle = t % 0.375;
            double drum = Math.Sin(2.0 * Math.PI * (110.0 * Math.Exp(-25.0 * cycle)) * t) * Math.Exp(-12.0 * cycle) * 0.45;
            
            // Double speed shaker click
            double clickCycle = t % 0.093;
            double click = (rand.NextDouble() * 2.0 - 1.0) * Math.Exp(-60.0 * clickCycle) * 0.05;

            // Upbeat guitar plucks at 659Hz (E5) and 783Hz (G5)
            int step = (int)(t / 0.187) % 8;
            double[] melodyNotes = { 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33, 523.25 };
            double melFreq = melodyNotes[step];
            double melEnv = Math.Exp(-18.0 * (t % 0.187));
            double melody = ((t * melFreq) % 1.0 < 0.5 ? 0.35 : -0.35) * melEnv * 0.2; // Square wave synth

            return drum + click + melody;
        });

        // 14. Stay (Fast Pop Keys Hook)
        GenerateTrack(Path.Combine(baseDir, "songs/stay.wav"), duration, sampleRate, t => {
            // Fast 170 BPM Pop beat
            double cycle = t % 0.35;
            double kick = Math.Sin(2.0 * Math.PI * (130.0 * Math.Exp(-40.0 * cycle)) * t) * Math.Exp(-10.0 * cycle) * 0.45;
            
            // Bright triangle-wave synthesizer keys (Fm -> Db -> Ab -> Eb)
            int phrase = (int)(t / 1.4) % 4;
            double[][] chords = {
                new double[] { 349.23, 440.00, 523.25 }, // Fm
                new double[] { 277.18, 349.23, 415.30 }, // Db
                new double[] { 415.30, 523.25, 622.25 }, // Ab
                new double[] { 311.13, 392.00, 466.16 }  // Eb
            };
            double[] activeChord = chords[phrase];
            int step = (int)(t / 0.175) % 8;
            double noteFreq = activeChord[step % activeChord.Length];
            double keyEnv = Math.Exp(-12.0 * (t % 0.175));
            double keys = (Math.Abs((t * noteFreq) % 1.0 - 0.5) * 4.0 - 1.0) * keyEnv * 0.25; // Triangle wave

            return kick + keys;
        });

        // 15. Arabic Kuthu (Oud Plucks & Koothu Drums)
        GenerateTrack(Path.Combine(baseDir, "songs/arabic_kuthu.wav"), duration, sampleRate, t => {
            // Arabian Phrygian Oud/Sitar arpeggios
            int step = (int)(t / 0.15);
            // Arabic scale frequencies: E4, F4, G#4, A4, B4, C5, D5
            double[] scale = { 329.63, 349.23, 415.30, 440.00, 493.88, 523.25, 493.88, 415.30 };
            double oudFreq = scale[step % scale.Length];
            double oudEnv = Math.Exp(-15.0 * (t % 0.15));
            // Sitar/Oud pluck metallic sound (sine + secondary harmonic)
            double oud = (Math.Sin(2.0 * Math.PI * oudFreq * t) + 0.3 * Math.Sin(2.0 * Math.PI * oudFreq * 2.02 * t)) * oudEnv * 0.35;

            // Fast Arabic style Kuthu drum beats
            double drumCycle = t % 0.3;
            double drum = Math.Sin(2.0 * Math.PI * (90.0 + 80.0 * Math.Exp(-20.0 * drumCycle)) * t) * Math.Exp(-12.0 * drumCycle) * 0.4;
            
            return oud + drum;
        });
    }
}
"@

Add-Type -TypeDefinition $source
[WavGenerator]::GenerateAll("C:\Users\shath\.gemini\antigravity\scratch\spotify_music_player")
Write-Host "Audio generation completed successfully!"
