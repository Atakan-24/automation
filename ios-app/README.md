# FeedClear – YouTube Feed Blocker (iOS App)

Eine native iOS App die den YouTube Home Feed dauerhaft blockiert.
Funktioniert als Safari Content Blocker Extension.

## Was die App macht
- Blockiert den YouTube Home Feed in Safari
- Blockiert YouTube Shorts (optional)
- Ein/Aus Toggle direkt in der App
- Kein Abo, einmalig kaufen → App Store ready

## Xcode Projekt aufsetzen

### Schritt 1 – Neues Xcode Projekt
1. Xcode öffnen → New Project → iOS → App
2. Product Name: `FeedClear`
3. Bundle Identifier: `com.DEINNAME.feedclear`
4. Interface: SwiftUI
5. Language: Swift

### Schritt 2 – Content Blocker Extension hinzufügen
1. File → New → Target → Content Blocker Extension
2. Product Name: `BlockerExtension`
3. Bundle ID wird automatisch: `com.DEINNAME.feedclear.BlockerExtension`

### Schritt 3 – App Group einrichten
1. Haupt-App Target → Signing & Capabilities → + App Groups
2. Group ID: `group.com.DEINNAME.feedclear`
3. Extension Target → gleiche App Group hinzufügen

### Schritt 4 – Dateien ersetzen
- `FeedClear/FeedClearApp.swift` → aus `Sources/App/`
- `FeedClear/ContentView.swift` → aus `Sources/App/`
- `BlockerExtension/ContentBlockerRequestHandler.swift` → aus `Sources/Extension/`
- `BlockerExtension/blockerList.json` → aus `Sources/Extension/`

### Schritt 5 – Bundle IDs anpassen
In allen Dateien `com.DEINNAME` durch deinen echten Bundle-Identifier ersetzen.

### Schritt 6 – App Store Upload
1. Apple Developer Account: developer.apple.com (99$/Jahr)
2. Product → Archive → Upload to App Store
3. App Store Connect: Preis setzen, Screenshots, fertig

## Empfohlener Verkaufspreis
- Einmalig: 0,99€ – 1,99€
- Oder: Gratis + Premium (Shorts-Blocker als InApp-Kauf)
