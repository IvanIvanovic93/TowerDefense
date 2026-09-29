# Podenco-Abenteuer

30-Sekunden-Zeichentrick (1920x1080, 30 fps, 900 Frames) mit Remotion, im Papercut-Stil: ausgeschnittene Papierteile in Ebenen mit Schlagschatten, Papierfaser und Stop-Motion-Zittern.

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
- `src/effects` – Papierfilter (`PaperDefs`: Schnittkante, Faser, Schlagschatten), Papierteile (`Ink`) und Kulissenteile (`Wash`), Papierkorn, Wind, Spritzer, Wellen
- `src/lib` – Palette, twos-Raster, Geometrie-Helfer

Figuren bewegen sich auf "twos" (`onTwos`) und zittern leicht wie beim Legetrick (`lib/jitter.ts`), Kamerafahrten und Parallax laufen auf ones.
