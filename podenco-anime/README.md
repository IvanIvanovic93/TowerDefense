# Podenco Anime

30-Sekunden-Actionclip im Anime-Stil mit Remotion (React + TypeScript): Ein weißer Podenco jagt dem Hut des Postboten hinterher, durch Markt, Fischstand, Taubenschwarm, über die Dächer und ins Hafenbecken.

- Composition `PodencoAnime`: 1920x1080, 30 fps, 900 Frames
- Soundtrack: selbst synthetisierter Metal-Track (150 BPM = 12 Frames pro Schlag, Hits liegen exakt auf den Schnitten)

## Befehle

```bash
npm install
npm run dev            # Remotion Studio
npm run music          # Soundtrack neu erzeugen -> public/soundtrack.wav
npm run render         # -> out/podenco-anime.mp4
npx remotion still CastSheet out/cast.png   # Figurenblatt
```

## Aufbau

- `src/Video.tsx`: Shotliste mit Start/Ende pro Shot, jeder Shot als eigene `<Sequence>`
- `src/scenes/`: 21 Shots, je eine Komponente
- `src/characters/`: Podenco (Seite, frontal, Gesicht, Chibi, Riesenauge), Postbote, Hut, Tauben, Fische. Ohren, Kopf, Augen, Beine und Schwanz sind getrennt animierbar
- `src/effects/`: Speedlines (radial, horizontal), Impact-Frame, Weißblitz, Screen Shake, Zoom Punch, Speed Ramp, Staub, Wasserspritzer, Glitzersterne
- `src/sets/`: gemalte Hintergründe (Himmel, Wolken, Hafenstadt, Markt, Froschperspektive)
- `src/lib/`: Palette, Cel-Shading (Grundfarbe + harter Schatten + Glanzkante), Konturformen
- `scripts/soundtrack.mjs`: Synthese des Soundtracks (Gitarren, Bass, Drums, Clean-Gitarre, Lead, Effekte)
