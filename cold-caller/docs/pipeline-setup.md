# Full Pipeline Setup — Team Gold Cold Caller

## What This System Does (Fully Automatic)

1. Every weekday at 9am: searches Google Maps for home service businesses without websites
2. Filters out businesses already contacted
3. Generates a personalized website preview URL for each business
4. Sends WhatsApp message with the draft link
5. Waits 2 minutes
6. VAPI calls them: "Hey, I just sent you a website draft..."
7. Saves everything to Google Sheets

---

## What You Need to Set Up (One Time)

### 1. Google Places API Key (Free — 1,000 searches/month)

1. Go to console.cloud.google.com
2. Create a new project
3. Enable "Places API"
4. Go to Credentials → Create API Key
5. Copy the key
6. In `full-pipeline-workflow.json`, replace `REPLACE_WITH_GOOGLE_PLACES_API_KEY`

### 2. Google Sheets

1. Create a new Google Sheet at sheets.google.com
2. Name it: `Team Gold Leads`
3. Create two tabs:
   - `Leads` — columns: business_name, phone, industry, city, state, address, has_website, rating, reviews_count, place_id, preview_url, status, call_id, called_at, outcome, meeting_booked, added_at
   - `Call Results` — columns: call_id, phone, business_name, duration_seconds, ended_reason, summary, transcript, timestamp
4. Copy the Sheet ID from the URL and replace all `REPLACE_WITH_GOOGLE_SHEET_ID`

### 3. Twilio WhatsApp (for automated sending)

1. Sign up at twilio.com
2. Enable WhatsApp Sandbox (free for testing) or apply for WhatsApp Business API
3. Get your Account SID and Auth Token
4. Replace `REPLACE_WITH_TWILIO_ACCOUNT_SID` and `REPLACE_WITH_TWILIO_WHATSAPP_NUMBER`
5. Add your Twilio credentials to n8n under Credentials → Basic Auth

**Alternative without Twilio:** Skip the WhatsApp node and send messages manually.
The `wa_message` field in Google Sheets will have the pre-written message ready to copy-paste.

### 4. Preview Website on teamgoldllc.de

Upload `preview/index.html` to your website at: `teamgoldllc.de/preview/index.html`

The URL will look like:
`https://teamgoldllc.de/preview?name=ABC+Plumbing&type=plumber&city=Austin&phone=5551234567`

This page automatically shows a custom website for each business using the URL parameters.

### 5. n8n

1. Go to n8n.io → sign up for free cloud account
2. Create new workflow → Import from JSON → paste `full-pipeline-workflow.json`
3. Fill in all REPLACE_WITH_ values
4. Connect Google Sheets credential
5. Activate the workflow

---

## Customize Target Cities & Industries

In the workflow, open the "Set Target City & Industry" node and edit:

```javascript
const INDUSTRIES = ['plumber', 'electrician', 'hvac contractor', 'roofer', 'painter'];
const CITIES = ['Austin TX', 'Houston TX', 'Dallas TX', 'Phoenix AZ', 'Las Vegas NV'];
const LEADS_PER_RUN = 10; // how many businesses to call per day
```

---

## What Happens on Each Call

Ryan (the AI) picks up and says:
"Hey, is this [Business Name]? — Hey, this is Ryan from Team Gold. We built a free website draft for [Business] and I just sent it on WhatsApp. Did you get it?"

If they haven't seen it: "I literally just sent it — check your WhatsApp, it's a website built specifically for a [industry] in [city]."

Goal: book a 30-min call with Atakan at cal.com/atakanoztunc/30min

---

## Cost per 10 Leads/Day

| Service | Cost |
|---------|------|
| Google Places API | Free (under 1k/month) |
| VAPI calls (~2 min avg) | ~$1/day |
| Twilio WhatsApp | ~$0.05/message = $0.50/day |
| n8n cloud | Free tier |
| Total | ~$1.50/day for 10 leads |

---

## VAPI Credentials (Already Configured)

- Assistant ID (English/Ryan): `bdcc6edf-095f-4cdc-93d5-a138be0b1c0b`
- Assistant ID (German/Felix): `ace39267-e43d-4c8d-a423-b6301bab1667`
- Phone Number ID: `e1be79b3-b1c3-42a4-a744-b298be092b26`
- Phone Number: +1 (757) 743-9084
- VAPI API Key: stored in workflow
