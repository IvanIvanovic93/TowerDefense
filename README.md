# Fallenfürst

Ein Level-Baukasten für das Handy, in dem du der Bösewicht bist. Dutzende Helden rennen pro Runde vom Portal zu deinem Schloss. Du baust die Strecke: Blöcke, Löcher, Fallen (auch frei in der Luft) und kleine Gegner. Die Helden laufen, springen über Lücken und Mauern, weichen Fallen aus, die sie erkennen, und springen deine Gegner platt. Jeder getötete Held bringt Gold. Das Schloss geht nicht kaputt, Ziel ist, dass kein Held durchkommt.

## Spielen

Reines HTML5/Canvas ohne Build-Schritt. `index.html` im Browser öffnen oder per GitHub Pages hosten. Am Handy: "Zum Startbildschirm hinzufügen" startet es im Vollbild-Querformat.

## Erster Start

Beim ersten Spiel führt eine kurze Einführung direkt im Spiel durch die ersten Schritte: Loch wählen, auf den markierten Boden tippen, Runde starten, Steine werfen. Sie lässt sich jederzeit überspringen und erscheint nur einmal. Später markiert ein "Neu"-Abzeichen frisch freigeschaltete Bauteile.

## Grafik

Düstere, gemalte Optik: Nebel- und Silhouetten-Ebenen mit Parallax, Lichtschächte, schwebende Leuchtpunkte, dunkle Figuren mit hellen Masken, glühende Augen und Feuer. Oberfläche mit Cinzel und Cormorant Garamond, feinen Linien und Ornamenten. Drei Welten wechseln nach jedem Boss: Nebelwald, Kristallgrotte, Aschenburg (mit Lava).

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
| Stachi | Stacheliger Gegner mit viel Leben, draufspringen verletzt |

Kreaturen haben Lebenspunkte. Helden, die nicht drüberspringen können (zum Beispiel im Tunnel), kämpfen sich durch.

Die Bauleiste lässt sich nach Art (Gelände, Fallen, Kreaturen) oder nach Kosten sortieren.

Alles hat 3 Stufen. Abreißen gibt 70 % zurück, in derselben Bauphase 100 %.

## Regeln

- **Sterne:** Bestanden unter 10 % Durchbrüchen (Bronze), höchstens 5 % Silber, keiner Gold.
- **Nicht bestanden:** Runde wiederholen, Gold aus Kills bleibt (in Wiederholungen halbiert).
- **Bestanden, aber nicht perfekt:** Du wählst selbst: nochmal spielen für mehr Sterne (Gold und Bauten bleiben) oder weiter zur nächsten Runde.
- **Budget:** Jede Runde 150 + 20 pro Runde. Restgold verfällt, Bauten bleiben.
- **Boss:** Jede 5. Runde Paladine. Danach neue Welt mit leerem Feld und großem Budget.
- **Strecke:** Am Anfang 30 Felder, pro geschaffter Runde 2 mehr.

## Karte

Jede Welt besteht aus 5 Feldern, das fünfte ist die Bossburg. Nach jeder geschafften Runde zeigt die Karte deine Sterne und der Lord läuft ein Feld weiter nach oben. Nach dem Boss geht es in die nächste Welt. Sichtbar ist immer nur die aktuelle und die nächste Welt. Die Karte lässt sich auch über das Menü öffnen und mit dem Finger verschieben.

## Burg (Fortschritt über Durchgänge)

Zu Beginn sind nur Block, Loch und Stacheln frei. Kommst du nicht mehr weiter, setzt du die Burg zurück (Menü oder nach einer verlorenen Runde): der Durchgang startet neu bei Runde 1, jeder geholte Stern wird zu einem Burgpunkt.

Ausgebaut wird nur über den Burg-Knopf oben links neben dem Lord. Der Balken darunter zeigt, wie viele Burgpunkte bis zur nächsten Stufe fehlen. Im Spiel siehst du immer nur, was die nächste Stufe bringt, spätere Freischaltungen bleiben verborgen, gesperrte Bauteile tauchen in der Bauleiste gar nicht erst auf.

- **Kosten:** 6, 10, 15, 21, 28, 36 … Burgpunkte pro Stufe, jede Stufe teurer als die vorige.
- **Stärke:** Jede Stufe gibt allen Fallen und Kreaturen 10 % mehr Schaden und Blöcken, Kanonen und Kreaturen 10 % mehr Leben. Ein Ritter, der in Runde 15 einen Block mit zwei Schlägen zerlegt, braucht mit ausgebauter Burg deutlich länger.
- **Aussehen:** Die Burg wächst sichtbar mit: Strohhütte, Holzhaus, Palisade, Bergfried, Festung, Schloss, großes Schloss. Schergen stehen auf den Mauern.

Da auch die Helden von Runde zu Runde deutlich mehr Leben bekommen, kommt man ab den späteren Welten ohne Burgausbau nicht mehr weit.

## Helden

Knappe, Schurke (springt weit und hoch), Ritter (gepanzert, springt kaum), Klerikerin (heilt), Magier (schwebt über Lücken und Bodenfallen), Paladin (Boss, klettert aus Löchern). Mit jeder Runde werden sie klüger und springen weiter. Leben, Schlagkraft gegen Blöcke und Kreaturen und die Heilung wachsen mit demselben Faktor: `1 + 0,3·(R−1) + 0,35·max(0, R−5) + 0,6·max(0, R−10)` (Runde 5: ×2,2, Runde 10: ×5,45, Runde 15: ×11,7). Der Startknopf zeigt die aktuelle Stärke, zähere Helden haben breitere Lebensleisten. Wer von einem Gegner getroffen wird, lernt daraus.

## Dunkler Lord

Während einer Runde auf die Strecke tippen: der Lord wirft einen Stein im Bogen dorthin, eine Markierung zeigt den Einschlag. Kills geben Erfahrung, jede Lord-Stufe einen Punkt für Wurfkraft, Nachladen oder Radius. Der Lord behält seine Stufe, bis ein neues Spiel beginnt.
