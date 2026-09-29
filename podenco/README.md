# Podenco-Abenteuer

30-Sekunden-Zeichentrick (1920x1080, 30 fps, 900 Frames) mit Remotion, im Stil der frühen 60er (Xerografie-Look).

## Befehle

```console
npm i
npm run dev      # Remotion Studio
npm run render   # rendert out/podenco.mp4
npx remotion still DogSheet out/hund.png    # Figurenblatt Hund
npx remotion still PostSheet out/post.png   # Figurenblatt Postbote
```

## Aufbau

- `src/characters` – Podenco (getrennt animierbare Ohren, Kopf, 4 Beine, Schwanz, Augen), Posen (`podencoPoses.ts`: Laufzyklus mit 8 Zeichnungen, Sprung, Schwimmen, Sitzen, Liegen, Ohren-Squash-&-Stretch), Postbote, Hut, Taube, Fisch
- `src/scenes` – sechs Szenen plus Kulissen in `scenes/sets`
- `src/effects` – Boiling Lines (`BoilDefs`, Seed wechselt alle 3 Frames), Tuschekontur mit versetzter Farbfläche (`Ink`), Aquarellflächen (`Wash`), Papierkorn, Wind, Spritzer, Wellen
- `src/lib` – Palette, twos-Raster, Geometrie-Helfer

Figuren bewegen sich auf "twos" (`onTwos`), Kamerafahrten und Parallax laufen auf ones.
