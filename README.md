# Fallenfürst

2D-Plattformer-Tower-Defense fürs Handy. Du bist der Dunkle Lord: Dutzende Helden rennen gleichzeitig vom Portal zu deinem Schloss und versuchen, deinen Fallen auszuweichen. Zwischen den Runden stellst du neue Fallen auf. Jeder getötete Held bringt Gold. Das Schloss geht nicht kaputt - Ziel ist, dass kein Held mehr durchkommt.

## Regeln

- **Sterne:** Eine Runde ist bestanden, wenn unter 10 % der Helden durchkommen (Bronze). Höchstens 5 % = Silber, keiner = Gold.
- **Nicht bestanden:** Die Runde wird wiederholt. Das Gold aus den Kills bleibt, in Wiederholungen gibt es aber nur halbes Gold pro Kill.
- **Budget:** Jede Runde startet mit festem Gold (150 + 20 pro Runde). Restgold verfällt beim Weiterkommen, die Fallen bleiben stehen.
- **Boss:** Jede 5. Runde kommen Paladine. Danach wird das Feld geräumt, und du baust mit einem großen Budget neu auf (Summe aller bisherigen Rundenbudgets).
- **Strecke:** Am Anfang kurz (passt auf einen Bildschirm), mit jeder geschafften Runde 2 Felder länger.
- **Barrikaden:** Helden bleiben im Feld davor stehen, Fallen dort treffen sie also voll.
- **Stampfer:** Solange der Block unten ist, kommt keiner vorbei.

## Dunkler Lord

Während einer Runde auf die Strecke tippen: der Lord wirft einen Stein dorthin (Flächenschaden, mit Nachladezeit). Jeder getötete Held gibt 1 Erfahrung, ein Paladin 10. Jede Lord-Stufe gibt einen Punkt für Wurfkraft, Nachladen oder Einschlag-Radius (je bis 10). Der Lord-Fortschritt bleibt dauerhaft erhalten, auch bei einem neuen Spiel.

## Spielen

Reines HTML5/Canvas ohne Build-Schritt. `index.html` im Browser öffnen oder das Repo per GitHub Pages hosten (Settings → Pages → Branch wählen). Am Handy: Seite öffnen → "Zum Startbildschirm hinzufügen" startet das Spiel im Vollbild-Querformat.

## Fallen

| Falle | Wirkung |
|---|---|
| Stacheln | Schaden am Boden |
| Grube | Sofortiger Tod, füllt sich aber mit gefallenen Helden (4/6/9 pro Feld). Upgrade = tiefer und getarnt |
| Barrikade | Blockiert, Helden müssen sie zerschlagen. Wird jede Runde repariert |
| Frostrune | Verlangsamt, verlangsamte Helden springen zu kurz |
| Katapult | Schleudert Helden zurück durch deine Fallen |
| Flammen | Feuersäule im Takt, trifft auch Springer |
| Stampfer | Zerquetscht alles darunter im Takt |
| Pfeilturm | Schießt auf den vordersten Helden |

Jede Falle hat 3 Stufen. Verkaufen gibt 70 % zurück, in derselben Bauphase 100 %.

## Helden

Knappe, Schurke (springt weit), Ritter (gepanzert), Klerikerin (heilt), Magier (schwebt über Bodenfallen), Paladin (Boss, klettert aus Gruben). Helden erkennen Fallen abhängig von ihrem Geschick und springen darüber; mit jeder Runde werden sie klüger, springen weiter und halten mehr aus.

Der Spielstand wird automatisch im Browser gespeichert.
