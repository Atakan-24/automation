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

## SCHRITT 5 — Nachrichten-Vorlage (Template) erstellen

Kalt-Nachrichten müssen von Meta freigegebene Vorlagen sein.

1. Gehe zu **https://business.facebook.com/wa/manage/message-templates**
   (oder in der App: WhatsApp → „Vorlagen verwalten").
2. **„Vorlage erstellen"** klicken.
3. Kategorie: **Marketing**.
4. Name vergeben (nur Kleinbuchstaben + Unterstriche), z.B.: **`team_gold_intro`**
   → **Das ist WERT 3 (Template-Name).**
5. Sprache: **English (US)**.
6. **Inhalt (Body)** — genau so eintragen (das `{{1}}` ist der Firmenname, wird automatisch eingesetzt):

   ```
   Hi {{1}}! This is Atakan from Team Gold. I noticed your business doesn't
   have a website yet — I build clean, professional sites for local businesses.
   Want a free preview made just for you? Just reply YES. Reply STOP to opt out.
   ```

7. Bei „Beispiel" für `{{1}}` ein Beispiel eingeben, z.B. `Joe's Electric`.
8. **Absenden zur Prüfung.**

⏳ Freigabe meist **wenige Minuten bis 24 Stunden**. Status muss **„Aktiv/Approved"** sein.

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

## SCHRITT 8 — Frischen n8n API-Key holen

Damit ich (Claude) die Werte ins System eintragen kann.

1. n8n öffnen: **http://217.154.67.223**
2. Unten links auf den **eigenen Namen/Account** → **„Settings"**.
3. Menü **„n8n API"**.
4. **„Create an API Key"** klicken.
5. Key kopieren.

> 📌 Langer Text (beginnt mit `eyJ...`). **Das ist WERT 5.**

---

## ✅ DAS SCHICKST DU ZURÜCK AN ATAKAN / CLAUDE

Kopiere diese Liste und fülle sie aus:

```
1. WHATSAPP_ACCESS_TOKEN   = EAA...          (aus Schritt 6)
2. WHATSAPP_PHONE_NUMBER_ID = 1234567890...  (aus Schritt 4)
3. WHATSAPP_TEMPLATE_NAME  = team_gold_intro (aus Schritt 5)
4. WHATSAPP_VERIFY_TOKEN   = teamgold2026verify (aus Schritt 7)
5. N8N_API_KEY             = eyJ...          (aus Schritt 8)
```

**Zusätzlich melden, falls ein Problem auftrat bei:**
- Business-Verifizierung noch nicht durch? → trotzdem Werte schicken, Test geht schon.
- Webhook-URL https-Problem? → Atakan Bescheid geben (Domain/SSL nötig).
- Template noch „in Prüfung"? → Name trotzdem schicken, wird automatisch aktiv.

---

## Was danach passiert (macht Claude/Atakan)
1. Die 5 Werte werden in die n8n-Workflows eingetragen.
2. Test-Nachricht an die eigene Nummer → kommt sie an?
3. Test-Antwort „YES" → kommt der Telegram-Alarm?
4. Kleiner Live-Lauf (25 Nachrichten) → dann hochfahren auf 100/Tag.

**Steuerung läuft komplett über den bestehenden Telegram-Bot:**
- `/start` → Outreach jetzt starten
- `/status` → was läuft, Kosten heute
- `/r <nummer> <text>` → auf eine WhatsApp-Nachricht antworten
- `/stop` / `/resume` → pausieren / weiterlaufen
