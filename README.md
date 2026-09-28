# Fallenfürst

Ein Level-Baukasten für das Handy, in dem du der Bösewicht bist. Dutzende Helden rennen pro Runde vom Portal zu deinem Schloss. Du baust die Strecke: Blöcke, Löcher, Fallen (auch frei in der Luft) und kleine Gegner. Die Helden laufen, springen über Lücken und Mauern, weichen Fallen aus, die sie erkennen, und springen deine Gegner platt. Jeder getötete Held bringt Gold. Das Schloss geht nicht kaputt, Ziel ist, dass kein Held durchkommt.

## Spielen

Reines HTML5/Canvas ohne Build-Schritt. `index.html` im Browser öffnen oder per GitHub Pages hosten. Am Handy: "Zum Startbildschirm hinzufügen" startet es im Vollbild-Querformat.

## Spielstand

"Neues Spiel" setzt alles auf null, auch die Burg (mit Bestätigung). "Burg zurücksetzen" im Spiel startet nur den Durchgang neu und behält die Burgstufe. Mit jeder veröffentlichten Version (`DATA_VERSION` in `index.html`) werden alle Spielstände gelöscht, nur Einführung und Sortierung bleiben.

## Erster Start

Beim ersten Spiel führt eine kurze Einführung direkt im Spiel durch die ersten Schritte: Loch wählen, auf den markierten Boden tippen, Runde starten, Steine werfen. Sie lässt sich jederzeit überspringen und erscheint nur einmal. Später markiert ein "Neu"-Abzeichen frisch freigeschaltete Bauteile.

## Grafik

Düstere, gemalte Optik: Nebel- und Silhouetten-Ebenen mit Parallax, Lichtschächte, schwebende Leuchtpunkte, dunkle Figuren mit hellen Masken, glühende Augen und Feuer. Oberfläche mit Cinzel und Cormorant Garamond, feinen Linien und Ornamenten. Drei Welten wechseln nach jedem Boss: Nebelwald, Kristallgrotte, Aschenburg (mit Lava).

## Bauteile

| Bauteil | Wirkung |
|---|---|
| Block | Mauern, Treppen, Plattformen. Helden springen drüber oder schlagen ihn kaputt |
| Loch | Reißt den Boden auf. Gefallene Helden füllen es nach und nach |
| Stacheln | Schaden am Boden. Jede Berührung sticht sofort (höchstens einmal pro Sekunde), Herumhüpfen schützt also nicht |
| Flammen | Feuersäule im Takt, drei Felder hoch |
| Feuerrad | Kreisende Feuerkugeln, frei in der Luft |
| Stampfer | Kracht herunter, sobald ein Held darunter ist |
| Kanone | Schießt Kugeln nach links, zählt als Block |
| Katapult | Schleudert Helden zurück |
| Kriecher | Kleiner Gegner, läuft hin und her, kann plattgesprungen werden |
| Flatterer | Fliegt auf und ab |
| Stachi | Stacheliger Gegner mit viel Leben, draufspringen verletzt |

Hängt ein Held 5 Sekunden fest, teleportiert er sich ein Stück weiter (violetter Riss an Start und Ziel).

Kreaturen haben Lebenspunkte. Helden, die nicht drüberspringen können (zum Beispiel im Tunnel), kämpfen sich durch.

Die Bauleiste lässt sich nach Art (Gelände, Fallen, Kreaturen) oder nach Kosten sortieren.

Alles hat 3 Stufen. Aufwerten hängt an der Burg: Mit Burgstufe 1 geht es gar nicht, ab Burgstufe 2 bis Stufe 2, ab Burgstufe 5 bis Stufe 3. Abreißen gibt 70 % zurück, in derselben Bauphase 100 %.

## Regeln

- **Sterne:** Bestanden unter 10 % Durchbrüchen (Bronze), höchstens 5 % Silber, keiner Gold.
- **Nicht bestanden:** Runde wiederholen, Gold bleibt. Ein Knappe bringt etwa 1 Gold, jeder weitere Versuch derselben Runde 30 % weniger pro Kill, mindestens aber 1 Gold pro 4 Kills (Runde 5 über 5 Versuche: etwa 85, 60, 42, 29, 21 Gold).
- **Bestanden, aber nicht perfekt:** Du wählst selbst: nochmal spielen für mehr Sterne (Gold und Bauten bleiben) oder weiter zur nächsten Runde.
- **Budget:** Jede Runde 150 + 20 pro Runde. Restgold verfällt, Bauten bleiben.
- **Boss:** Jede 5. Runde Paladine. Eine Bossrunde ist nur bestanden, wenn jeder Paladin fällt. Der Paladin springt nicht über Mauern, sondern schlägt mit einem Hieb alles bis drei Felder hoch vor sich weg. Danach neue Welt mit leerem Feld und dreifachem Rundenbudget.
- **Strecke:** Am Anfang 30 Felder, pro geschaffter Runde 2 mehr.

## Karte

Jede Welt besteht aus 5 Feldern, das fünfte ist die Bossburg. Nach jeder geschafften Runde zeigt die Karte deine Sterne und der Lord läuft ein Feld weiter nach oben. Nach dem Boss geht es in die nächste Welt. Sichtbar ist immer nur die aktuelle und die nächste Welt. Die Karte lässt sich auch über das Menü öffnen und mit dem Finger verschieben.

## Burg (Fortschritt über Durchgänge)

Zu Beginn sind nur Block, Loch und Stacheln frei. Kommst du nicht mehr weiter, setzt du die Burg zurück (Menü oder nach einer verlorenen Runde): der Durchgang startet neu bei Runde 1, jeder geholte Stern wird zu einem Burgpunkt.

Ausgebaut wird nur über den Burg-Knopf oben links neben dem Lord. Der Balken darunter zeigt, wie viele Burgpunkte bis zur nächsten Stufe fehlen. Im Spiel siehst du immer nur, was die nächste Stufe bringt, spätere Freischaltungen bleiben verborgen, gesperrte Bauteile tauchen in der Bauleiste gar nicht erst auf.

- **Kosten:** 6, 10, 15, 21, 28, 36 … Burgpunkte pro Stufe, jede Stufe teurer als die vorige.
- **Stärke:** Jede Stufe gibt allen Fallen und Kreaturen 10 % mehr Schaden und Blöcken, Kanonen und Kreaturen 10 % mehr Leben, jeweils auf den bisherigen Wert (Faktor 1,1 hoch Stufe minus 1). Stufe 8 ergibt etwa ×1,95, Stufe 12 ×2,85, Stufe 16 ×4,18.
- **Aussehen:** Die Burg wächst sichtbar mit: Strohhütte, Holzhaus, Palisade, Bergfried, Festung, Schloss, großes Schloss. Schergen stehen auf den Mauern.

Da auch die Helden von Runde zu Runde deutlich mehr Leben bekommen, kommt man ab den späteren Welten ohne Burgausbau nicht mehr weit.

## Helden

Welt 1 nur Knappen. Nach jedem Boss kommt ein neuer Heldentyp dazu: Schurke ab Runde 6 (springt weit und hoch), Ritter ab Runde 11 (gepanzert, springt kaum), Klerikerin ab Runde 16 (heilt), Magier ab Runde 21 (schwebt über Lücken und Bodenfallen). Jede 5. Runde kommen Paladine (Boss, klettert aus Löchern). Dazwischen steigen Sprungweite und Klugheit und vor allem die Anzahl der Helden (Runde 1: 42, Runde 5: 74, Runde 10: 174, ab Runde 22: 400), damit Gruben mit ihrer festen Kapazität volllaufen. Große Wellen kommen dichter hintereinander. Mit jeder Runde werden sie klüger und springen weiter. Leben, Schlagkraft gegen Blöcke und Kreaturen und die Heilung wachsen mit Zinseszins um 10 % pro Runde (Runde 5: ×1,46, Runde 10: ×2,36, Runde 15: ×3,8), also genau wie die Burg pro Stufe. Ab Welt 3 (Runde 11) werden die Helden außerdem 2 % pro Runde schneller. Der Startknopf zeigt die aktuelle Stärke, zähere Helden haben breitere Lebensleisten.

## Dunkler Lord

Während einer Runde auf die Strecke tippen: der Lord wirft einen Stein im Bogen dorthin, eine Markierung zeigt den Einschlag. Jeder besiegte Boss bringt einen Lordpunkt. Ausgeben kostet zusätzlich Gold in Höhe eines Rundenbudgets, bei jeder weiteren Stufe derselben Fähigkeit 50 % mehr (Wurfkraft, Nachladen oder Radius). Setzt man die Burg zurück oder startet neu, fängt der Lord wieder bei Stufe 1 an.
