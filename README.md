# Fallenfürst

Ein Level-Baukasten für das Handy, in dem du der Bösewicht bist. Dutzende Helden rennen pro Runde vom Portal zu deinem Schloss. Du baust die Strecke: Blöcke, Löcher, Fallen (auch frei in der Luft) und kleine Gegner. Die Helden laufen, springen über Lücken und Mauern, weichen Fallen aus, die sie erkennen, und springen deine Gegner platt. Jeder getötete Held bringt Gold. Das Schloss geht nicht kaputt, Ziel ist, dass kein Held durchkommt.

## Spielen

Reines HTML5/Canvas ohne Build-Schritt. `index.html` im Browser öffnen oder per GitHub Pages hosten. Am Handy: "Zum Startbildschirm hinzufügen" startet es im Vollbild-Querformat.

## Grafik

Echte Pixel-Art: Welt aus 16×16-Kacheln, alle Figuren und Fallen als handgesetzte Pixel-Sprites, ganzzahlig skaliert ohne Filter. Drei Welten mit eigener Farbwelt wechseln nach jedem Boss: Wiese, Höhle, Burg (mit Lava).

## Bauteile

| Bauteil | Wirkung |
|---|---|
| Block | Mauern, Treppen, Plattformen. Helden springen drüber oder schlagen ihn kaputt |
| Loch | Reißt den Boden auf. Gefallene Helden füllen es nach und nach |
| Stacheln | Schaden am Boden |
| Flammen | Feuersäule im Takt, drei Felder hoch |
| Feuerrad | Kreisende Feuerkugeln, frei in der Luft |
| Stampfer | Kracht herunter, sobald ein Held darunter ist |
| Kanone | Schießt Kugeln nach links, zählt als Block |
| Katapult | Schleudert Helden zurück |
| Kriecher | Kleiner Gegner, läuft hin und her, kann plattgesprungen werden |
| Flatterer | Fliegt auf und ab |
| Stachi | Stacheliger Gegner, draufspringen verletzt |

Alles hat 3 Stufen. Abreißen gibt 70 % zurück, in derselben Bauphase 100 %.

## Regeln

- **Sterne:** Bestanden unter 10 % Durchbrüchen (Bronze), höchstens 5 % Silber, keiner Gold.
- **Nicht bestanden:** Runde wiederholen, Gold aus Kills bleibt (in Wiederholungen halbiert).
- **Budget:** Jede Runde 150 + 20 pro Runde. Restgold verfällt, Bauten bleiben.
- **Boss:** Jede 5. Runde Paladine. Danach neue Welt mit leerem Feld und großem Budget.
- **Strecke:** Am Anfang 30 Felder, pro geschaffter Runde 2 mehr.

## Helden

Knappe, Schurke (springt weit und hoch), Ritter (gepanzert, springt kaum), Klerikerin (heilt), Magier (schwebt über Lücken und Bodenfallen), Paladin (Boss, klettert aus Löchern). Mit jeder Runde werden sie klüger, springen weiter und halten mehr aus. Wer von einem Gegner getroffen wird, lernt daraus.

## Dunkler Lord

Während einer Runde auf die Strecke tippen: der Lord wirft einen Stein im Bogen dorthin, eine Markierung zeigt den Einschlag. Kills geben Erfahrung, jede Lord-Stufe einen Punkt für Wurfkraft, Nachladen oder Radius. Der Lord behält seine Stufe, bis ein neues Spiel beginnt.
