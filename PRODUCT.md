# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Öffentliche Spielerschaft ohne Vorwissen. Wer das Spiel zum ersten Mal öffnet, muss es ohne Erklärung von außen verstehen. Hauptgerät ist das Smartphone im Querformat mit Touch-Bedienung. Maus und Tastatur am Desktop funktionieren ebenfalls, stehen aber nicht im Vordergrund.

Gespielt wird in beiden Situationen: kurz zwischendurch (eine Runde schnell starten und beenden) und in längeren Sitzungen, in denen man an Aufbauten tüftelt und mehrere Durchgänge am Stück spielt.

## Product Purpose

Fallenfürst ist ein Level-Baukasten, in dem der Spieler der Bösewicht ist. Pro Runde rennen Dutzende Helden vom Portal zum Schloss des Dunklen Lords. Der Spieler baut die Strecke dazwischen und will verhindern, dass Helden durchkommen. Erfolg heißt: Runden mit möglichst wenigen Durchbrüchen bestehen, Sterne sammeln und die Burg über viele Durchgänge ausbauen.

## Positioning

Umgekehrter Jump-'n'-Run-Baukasten mit Tower-Defense-Druck: Man baut kein Level, das ein Held schaffen soll, sondern eines, an dem eine ganze Horde scheitern soll. Die Helden reagieren sichtbar und nachvollziehbar (springen über erkannte Fallen, kämpfen sich durch, lernen aus Treffern), der Spieler reagiert mit Bauten und dem Steinwurf des Lords.

## Operating Context

- **Bauphase:** Bauteil in der Leiste wählen, aufs Raster tippen. Bauteile antippen öffnet Upgrade und Abreißen. Wischen verschiebt die Kamera, die Übersichtsleiste oben springt an eine Stelle.
- **Runde:** Helden laufen automatisch. Der Spieler tippt auf die Strecke, damit der Lord einen Stein wirft. Tempo 1x bis 3x, Pause.
- **Nach der Runde:** Ergebnis mit Sternen (Bronze, Silber, Gold). Bei nicht perfekter Runde wählt der Spieler zwischen Nochmal und Weiter.
- **Meta-Fortschritt:** Kommt man nicht weiter, wird die Burg zurückgesetzt. Sterne werden zu Burgpunkten, die neue Bauteile und Schergen freischalten.

## Capabilities and Constraints

- Reines HTML5/Canvas ohne Build-Schritt, ausgeliefert als `index.html` mit `manifest.webmanifest` und `icon.svg`. Läuft auch als Claude-Artifact und über GitHub Pages.
- Spielstand, Burg-Fortschritt und Lord-Stufe liegen im `localStorage` des Geräts.
- **Offline spielbar ist Pflicht** (zum Beispiel als App auf dem Homescreen). Offene Lücke: Die Schriften werden aktuell von Google Fonts geladen und müssen für Offline-Betrieb ins Repo.
- Begriffe im Spiel: Bauteile (Gelände, Fallen, Kreaturen), Helden, Dunkler Lord, Schergen, Burg, Burgstufe, Burgpunkte, Sterne, Welten (Nebelwald, Kristallgrotte, Aschenburg), Bossrunde (Paladin).
- Nicht entschieden: Vertriebsweg der öffentlichen Veröffentlichung (Web-App, App Store oder beides), Monetarisierung.

## Brand Commitments

- Name: **Fallenfürst**.
- Sprache: **nur Deutsch**, keine weiteren Sprachen geplant.
- **Keine echten Marken:** Stil darf an bekannte Spiele angelehnt sein, Figuren, Namen und geschützte Designs werden nicht kopiert.
- Ton: augenzwinkernd böse aus Sicht des Bösewichts, kurz und direkt.

## Evidence on Hand

- Spielbare Version: `index.html` im Repo, veröffentlicht als Claude-Artifact.
- App-Icon: `icon.svg`.
- Keine Testimonials, Bewertungen, Downloadzahlen oder Presse vorhanden. Solche Angaben dürfen nicht erfunden werden.

## Product Principles

1. **Der Spieler ist der Bösewicht.** Perspektive, Texte und Belohnungen kommen aus Sicht des Lords, die Helden sind die Gegenseite.
2. **Bauen ist das Spiel.** Freie Platzierung und Kombinationen haben Vorrang vor festen Bauplätzen, eigene Ideen sollen sich lohnen.
3. **Fairer, lesbarer Widerstand.** Helden verhalten sich nachvollziehbar, jede verlorene Runde lässt sich erklären, und das Spiel hängt nie fest.
4. **Kurz einsteigen, lange dranbleiben.** Eine Runde ist schnell gespielt, der Fortschritt über Durchgänge trägt längere Sitzungen.
5. **Erklärung nur auf Abruf.** Die Oberfläche bleibt frei von Textwänden, Details stehen hinter Info-Knöpfen, trotzdem muss sich das Spiel für Fremde selbst erklären.

## Accessibility & Inclusion

Kein Standard festgelegt. Produktbedingt wichtig: gut treffbare Touch-Ziele und lesbare Schrift auf kleinen Bildschirmen im Querformat, reduzierte Bewegung wird respektiert.
