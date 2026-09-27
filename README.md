# Fallenfürst

2D-Plattformer-Tower-Defense fürs Handy. Du bist der Dunkle Lord: Dutzende Helden rennen gleichzeitig vom Portal zu deinem Schloss und versuchen, deinen Fallen auszuweichen. Zwischen den Runden stellst du neue Fallen auf. Jeder getötete Held bringt Gold. Das Schloss geht nicht kaputt - Ziel ist, dass kein Held mehr durchkommt.

Die nächste Runde gibt es erst, wenn in einer Runde kein einziger Held durchgekommen ist. Sonst wird die Runde wiederholt, das verdiente Gold bleibt. Die Strecke ist am Anfang kurz (passt auf einen Bildschirm) und wird mit jeder geschafften Runde länger.

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
