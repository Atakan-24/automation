# Anleitung: WhatsApp Business API einrichten (Meta Cloud API)

> **Ziel:** Die Business-Nummer `+20 106 956 4012` an die offizielle Meta WhatsApp API
> anschließen, damit das n8n-System automatisch 100 Nachrichten/Tag versenden kann.
>
> **Am Ende dieser Anleitung schickst du 5 Werte zurück** (ganz unten gesammelt).
> Plane ca. **1–2 Stunden** ein. Die Meta-Verifizierung kann 1–3 Tage dauern.

---

## ⚠️ WICHTIG vorab — bitte zuerst lesen

1. **Die Nummer verlässt die WhatsApp-App.** Sobald `+20 106 956 4012` an die API geht,
   funktioniert die normale grüne WhatsApp-App auf dieser Nummer **nicht mehr**.
   → **VORHER:** Alte Chats sichern (WhatsApp → Einstellungen → Chats → Chat-Verlauf exportieren).
2. **Du brauchst Zugriff auf die Nummer**, um einen SMS-/Anruf-Code zu empfangen (einmalig).
3. **Business-Verifizierung:** Meta verlangt Firmen-Dokumente. Halte bereit: Firmenname,
   Adresse, ggf. Gewerbenachweis/Website (`teamgoldllc.de`).

---

## SCHRITT 1 — Meta Business Konto erstellen

1. Gehe zu **https://business.facebook.com**
2. Oben rechts **„Konto erstellen"** klicken.
3. Eingeben: **Firmenname** (Team Gold LLC), dein Name, geschäftliche E-Mail.
4. E-Mail bestätigen (Link in der Mail anklicken).

✅ Du hast jetzt ein „Business Portfolio".

---

## SCHRITT 2 — Business verifizieren

1. In der Business Suite links unten **„Einstellungen"** (Zahnrad) öffnen.
2. Menü **„Unternehmensinfo"** → Firmendaten vollständig ausfüllen.
3. Menü **„Sicherheitscenter"** → **„Verifizierung starten"**.
4. Firmen-Dokument hochladen (Gewerbeschein, Rechnung mit Firmenadresse o.Ä.).
5. Absenden.

⏳ **Dauer: 1–3 Werktage.** Du kannst während des Wartens mit Schritt 3 weitermachen
(Test-Nachrichten gehen schon vorher, das volle 100/Tag-Limit erst nach Freigabe).

---

## SCHRITT 3 — WhatsApp-App im Meta-Konto hinzufügen

1. Gehe zu **https://developers.facebook.com/apps**
2. **„App erstellen"** klicken.
3. App-Typ: **„Business"** auswählen → Weiter.
4. App-Namen vergeben (z.B. „TeamGold Outreach") → mit dem Business-Portfolio aus Schritt 1 verknüpfen.
5. In der App-Übersicht das Produkt **„WhatsApp"** suchen → **„Einrichten"** klicken.

✅ Es öffnet sich das WhatsApp-Setup mit einer Test-Nummer.

---

## SCHRITT 4 — Eigene Nummer +20 106 956 4012 anschließen

1. Im WhatsApp-Setup links **„API-Setup"** öffnen.
2. Bei „Von" / „From" auf **„Telefonnummer hinzufügen"** klicken.
3. Nummer eingeben: **+20 106 956 4012**
4. Anzeigename eingeben (z.B. „Team Gold").
5. Bestätigungs-Methode wählen (SMS oder Anruf) → **Code anfordern**.
6. Den 6-stelligen Code, der an die Nummer kommt, eingeben.

✅ Die Nummer ist jetzt mit der API verbunden. **Ab jetzt ist sie aus der App raus.**

> 📌 **Notiere dir die `Phone Number ID`** — sie steht im API-Setup direkt bei der Nummer.
> Sieht aus wie: `123456789012345`. → **Das ist WERT 2.**

---

## SCHRITT 5 — ZWEI Nachrichten-Vorlagen (Templates) erstellen — Englisch + Deutsch

> Das System läuft für **USA (englisch)** UND **Deutschland (deutsch)**.
> Darum brauchen wir **zwei** freigegebene Vorlagen. Beide gleich anlegen, nur Sprache + Text unterscheiden sich.

1. Gehe zu **https://business.facebook.com/wa/manage/message-templates**
   (oder in der App: WhatsApp → „Vorlagen verwalten").

### 5a) Englische Vorlage (für USA)
2. **„Vorlage erstellen"** → Kategorie **Marketing**.
3. Name (nur Kleinbuchstaben + Unterstriche): **`team_gold_intro_en`**
   → **Das ist WERT 3a (Template-Name EN).**
4. Sprache: **English (US)**.
5. **Inhalt (Body)** — genau so (`{{1}}` = Firmenname, wird automatisch eingesetzt):

   ```
   Hi {{1}}! This is Atakan from Team Gold. I noticed your business doesn't
   have a website yet — I build clean, professional sites for local businesses.
   Want a free preview made just for you? Just reply YES. Reply STOP to opt out.
   ```

6. Bei „Beispiel" für `{{1}}` z.B. `Joe's Electric` eingeben → **Absenden zur Prüfung.**

### 5b) Deutsche Vorlage (für Deutschland)
7. Nochmal **„Vorlage erstellen"** → Kategorie **Marketing**.
8. Name: **`team_gold_intro_de`**
   → **Das ist WERT 3b (Template-Name DE).**
9. Sprache: **German / Deutsch**.
10. **Inhalt (Body)** — genau so (`{{1}}` = Firmenname):

    ```
    Hallo {{1}}! Ich bin Atakan von Team Gold. Mir ist aufgefallen, dass Ihr
    Unternehmen noch keine Website hat — ich baue professionelle Seiten für
    lokale Firmen. Möchten Sie eine kostenlose Vorschau? Antworten Sie mit JA.
    Mit STOP abmelden.
    ```

11. Bei „Beispiel" für `{{1}}` z.B. `Müller Elektrotechnik` eingeben → **Absenden zur Prüfung.**

⏳ Freigabe meist **wenige Minuten bis 24 Stunden**. Beide müssen **„Aktiv/Approved"** sein.

---

## SCHRITT 6 — Dauerhaften Zugriffs-Token erstellen (System-User)

Der Test-Token im API-Setup läuft nach 24h ab — wir brauchen einen **permanenten**.

1. Gehe zu **Business-Einstellungen** → **https://business.facebook.com/settings**
2. Links **„Benutzer" → „System-Benutzer"**.
3. **„Hinzufügen"** → Name (z.B. „n8n-bot") → Rolle **„Admin"** → Erstellen.
4. Den neuen System-Benutzer anklicken → **„Assets zuweisen"** → die WhatsApp-App auswählen
   → volle Kontrolle geben.
5. **„Token generieren"** klicken.
6. App auswählen, Ablauf auf **„Nie/Permanent"** stellen.
7. Diese Berechtigungen anhaken:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
8. **„Token generieren"** → Token kopieren.

> 📌 Der Token ist sehr lang (beginnt mit `EAA...`). **Das ist WERT 1.**
> ⚠️ Wird nur EINMAL angezeigt — sofort sicher kopieren!

---

## SCHRITT 7 — Webhook für eingehende Antworten einrichten

Damit Kunden-Antworten im Telegram-Bot ankommen.

1. Im App-Dashboard → WhatsApp → **„Konfiguration"**.
2. Bei **„Webhook"** auf **„Bearbeiten"** klicken.
3. **Callback-URL** eintragen:
   ```
   https://teamgoldllc.de/webhook/whatsapp-inbound
   ```
   > ⚠️ **WICHTIG:** Meta verlangt **https** (mit gültigem Zertifikat).
   > Falls die n8n-Server-Adresse `217.154.67.223` nur über `http` läuft,
   > muss Atakan/der Techniker das vorher als https einrichten (Domain + SSL).
   > **Diesen Punkt im Zweifel mit Atakan klären.**
4. **Verify-Token (Bestätigungs-Token)** ausdenken — irgendein Passwort, z.B.:
   ```
   teamgold2026verify
   ```
   → **Das ist WERT 4.** (Muss exakt mit dem im n8n eingetragenen übereinstimmen.)
5. **„Verifizieren und speichern"** klicken.
6. Danach bei **„Webhook-Felder"** auf **„Abonnieren"** bei **`messages`** klicken.

✅ Eingehende Nachrichten werden jetzt an das System weitergeleitet.

---

## SCHRITT 8 — Google Sheet für das Cold-Calling-Team anlegen

Das System trägt **jeden angeschriebenen Lead automatisch in ein Google Sheet** ein.
Das Team arbeitet die Liste ab (A-Leads zuerst), setzt Status und macht Notizen.

1. Gehe zu **https://sheets.google.com** → **leeres Tabellenblatt** erstellen.
2. Benenne es z.B. **„Team Gold Leads"**.
3. Das erste Tabellenblatt unten **exakt** `Leads` nennen (Doppelklick auf „Tabelle1" → umbenennen).
4. In **Zeile 1** diese Spaltentitel eintragen (genau so, eine pro Spalte A–N):

   ```
   Datum | Gesendet | Markt | Firma | Branche | Stadt | Bewertung | Reviews | Adresse | Telefon | Maps | Note | Status | Notizen
   ```

5. **Sheet-ID** aus der URL kopieren — der lange Teil zwischen `/d/` und `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/  DAS_IST_DIE_ID  /edit
   ```
   → **Das ist WERT 6.**
6. Oben rechts **„Freigeben"** → die E-Mail des Cold-Calling-Teams mit **Bearbeiter**-Recht hinzufügen.

> Hinweis: Die Google-Verbindung (OAuth) richtet Atakan/Claude direkt in n8n ein
> (einmaliges Einloggen mit dem Google-Konto). Du musst nur die Sheet-ID schicken.

---

## SCHRITT 9 — Frischen n8n API-Key holen

Damit ich (Claude) die Werte ins System eintragen kann.

1. n8n öffnen: **http://217.154.67.223**
2. Unten links auf den **eigenen Namen/Account** → **„Settings"**.
3. Menü **„n8n API"**.
4. **„Create an API Key"** klicken.
5. Key kopieren.

> 📌 Langer Text (beginnt mit `eyJ...`). **Das ist WERT 7.**

---

## ✅ DAS SCHICKST DU ZURÜCK AN ATAKAN / CLAUDE

Kopiere diese Liste und fülle sie aus:

```
1.  WHATSAPP_ACCESS_TOKEN    = EAA...              (aus Schritt 6)
2.  WHATSAPP_PHONE_NUMBER_ID = 1234567890...       (aus Schritt 4)
3a. WHATSAPP_TEMPLATE_NAME_EN = team_gold_intro_en (aus Schritt 5a)
3b. WHATSAPP_TEMPLATE_NAME_DE = team_gold_intro_de (aus Schritt 5b)
4.  WHATSAPP_VERIFY_TOKEN    = teamgold2026verify  (aus Schritt 7)
6.  GOOGLE_SHEET_ID          = 1AbC...             (aus Schritt 8)
7.  N8N_API_KEY              = eyJ...              (aus Schritt 9)
```

**Zusätzlich melden, falls ein Problem auftrat bei:**
- Business-Verifizierung noch nicht durch? → trotzdem Werte schicken, Test geht schon.
- Webhook-URL https-Problem? → Atakan Bescheid geben (Domain/SSL nötig).
- Template noch „in Prüfung"? → Name trotzdem schicken, wird automatisch aktiv.

---

## Was danach passiert (macht Claude/Atakan)
1. Die Werte werden in die n8n-Workflows eingetragen (EN + DE Template, Sheet, Google-Login).
2. Test-Nachricht an eine eigene Nummer → kommt sie an (USA = englisch, DE = deutsch)?
3. Test-Antwort „YES" / „JA" → kommt der Telegram-Alarm?
4. Kleiner Live-Lauf (je 25 USA + 25 DE) → dann hochfahren auf 50+50 = 100/Tag.
5. Jeder gesendete Lead landet automatisch im Google Sheet (mit Sende-Zeit für den Anruf).

**Steuerung läuft komplett über den bestehenden Telegram-Bot:**
- `/start` → Outreach jetzt starten
- `/status` → was läuft, Kosten heute
- `/r <nummer> <text>` → auf eine WhatsApp-Nachricht antworten
- `/stop` / `/resume` → pausieren / weiterlaufen
