# Fallenfürst

Einzelne Datei `index.html` (HTML5/Canvas, kein Build). Spieltexte nur auf Deutsch.

## Bei jedem Push

`DATA_VERSION` in `index.html` erhöhen (Format `JJJJ-MM-TT.N`). Dadurch starten alle Spieler nach dem Update wieder bei null: Spielstand, Lord, Burg, Neu-Markierungen und Einführung werden gelöscht, nur die Sortierung bleibt. Ausnahme nur, wenn der Nutzer ausdrücklich einen Stand zum Weitertesten behalten will.
