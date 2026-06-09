# Setup Guide — AI Cold Caller

Follow these steps in order. Takes about 45–60 minutes to complete.

---

## Step 1: Create VAPI Account

1. Go to **vapi.ai** → Sign up for a free account
2. Open Dashboard
3. Click **Build** → **Assistants** → **Create Assistant**
4. Name it: `Ryan - Cold Caller`
5. Select **Blank Template** → click **Create**

### Configure the Assistant:

**AI Model:**
- Click the Model section
- Select **GPT-4o** (best balance of quality and speed)
- Temperature: **0.7**

**First Message:**
- Paste the content from `vapi/first-message.txt`
- This is the FIRST thing the AI says when the call connects

**System Prompt:**
- Paste the ENTIRE content from `vapi/system-prompt.txt`
- This is the AI's brain — personality, sales script, objection handling

**Voice Setup:**
1. Scroll down to the Voice section
2. Provider: **ElevenLabs**
3. Create a free account at elevenlabs.io
4. Go to Voices → find a natural-sounding American male voice (recommended: **Josh** or **Matthew**)
5. Click the 3 dots on the voice → **Copy Voice ID**
6. Back in VAPI: paste the Voice ID

**Voicemail Detection:**
- Enable **Voicemail Detection** (toggle on)
- This makes the AI leave a voicemail automatically

7. Click **Publish**
8. Note your **Assistant ID** (copy it from the URL or settings — you'll need this)

---

## Step 2: Get a US Phone Number via Twilio

1. Go to **twilio.com** → Sign up
2. Verify your account (they ask for a credit card)
3. Go to **Phone Numbers** → **Manage** → **Buy a Number**
4. Search for US numbers, choose any available number (~$1.15/month)
5. Buy the number
6. Go to your **Account Dashboard** → scroll down
7. Note your:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)

---

## Step 3: Connect Twilio Phone Number to VAPI

1. In VAPI Dashboard → **Phone Numbers** → **Create Phone Number**
2. Select **Import Twilio**
3. Enter:
   - Phone number (with +1 country code)
   - Twilio Account SID
   - Twilio Auth Token
4. Click **Import**
5. Once imported, scroll down to **Assistant**
6. Select **Ryan - Cold Caller**
7. Click **Save**
8. Note your **Phone Number ID** (shown in the phone number details)

---

## Step 4: Set Up Google Sheets

1. Go to **Google Sheets** → Create a new spreadsheet
2. Name it: `Cold Caller Leads`
3. Create two sheets (tabs at the bottom):
   - Sheet 1: rename to `Leads`
   - Sheet 2: rename to `Call Results`

**Leads sheet — add these column headers in row 1:**
```
business_name | owner_name | phone | industry | city | state | has_website | website_url | status | call_id | called_at | outcome | meeting_booked | meeting_time | email | notes
```

**Call Results sheet — add these column headers in row 1:**
```
call_id | phone | business_name | duration_seconds | ended_reason | summary | transcript | timestamp
```

4. Copy the sample data from `sheets/leads-template.csv` to populate your first leads, OR add your own leads manually
5. Copy the **Google Sheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit`
   - Copy the long ID string

---

## Step 5: Set Up n8n

1. Go to **n8n.io** → Sign up for free cloud account (or self-host)
2. Create a new workflow

### Import Workflow 1 — Outbound Calls:
1. Click the 3 dots menu → **Import from JSON**
2. Paste the contents of `n8n/outbound-calls-workflow.json`
3. Replace these placeholder values in the workflow:
   - `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` → your actual Sheet ID
   - `REPLACE_WITH_YOUR_VAPI_API_KEY` → get this from VAPI Dashboard → Settings → API Keys
   - `REPLACE_WITH_YOUR_ASSISTANT_ID` → your VAPI assistant ID
   - `REPLACE_WITH_YOUR_PHONE_NUMBER_ID` → your VAPI phone number ID
4. Connect your **Google Sheets credential** (click on any Google Sheets node → connect)
5. Click **Save**

### Import Workflow 2 — Call Results Webhook:
1. Create another new workflow
2. Import from JSON → paste contents of `n8n/call-results-webhook.json`
3. Replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID`
4. Connect your Google Sheets credential
5. Click **Save** → click **Activate** (toggle at top right)
6. Copy the **Webhook URL** shown in the webhook node

---

## Step 6: Connect VAPI Webhook to n8n

1. In VAPI Dashboard → **Settings** → **Webhooks** (or in your Assistant settings)
2. Server URL: paste your n8n webhook URL
3. This makes VAPI send call results to n8n automatically after every call

---

## Step 7: Get Your VAPI API Key

1. VAPI Dashboard → **Settings** → **API Keys**
2. Click **Create API Key**
3. Copy the key
4. Paste it into the n8n outbound calls workflow (replacing the placeholder)

---

## Step 8: Test the Full System

1. Add yourself as a lead in the Google Sheet:
   - business_name: Test Business
   - phone: your own US phone number (without +1)
   - industry: plumber
   - city: your city
   - status: pending
2. In n8n → open the Outbound Calls workflow
3. Click **Execute Workflow** (manual trigger)
4. Wait for your phone to ring
5. Have a conversation with the AI
6. After the call ends, check the Call Results sheet — the summary and transcript should appear

---

## Step 9: Finding Real Leads

Best free methods:

**Google Maps:**
1. Search `plumber [city name]` in Google Maps
2. Click through results — many show "No website" in the listing
3. Click the business → get their phone number

**Yelp:**
1. Search `plumbers` in any US city
2. Sort by rating
3. Many listings have phone numbers but no website linked

**Best paid tool:**
- **D7 Lead Finder** (~$30/month) — scrapes Google Maps automatically
- Search by industry + city and exports phone numbers to CSV

---

## Step 10: Going Live

1. Add 20–50 leads to your Google Sheet
2. Go to the Outbound Calls workflow in n8n
3. Click **Execute Workflow**
4. The AI will call each lead one by one, waiting 60 seconds between calls
5. Monitor results in the Call Results sheet
6. Follow up personally on any booked meetings

---

## Cost Estimates

| Scenario | Calls/Day | Daily Cost |
|----------|-----------|------------|
| Testing | 10 calls | ~$2–4 |
| Small scale | 50 calls | ~$10–20 |
| Full scale | 200 calls | ~$40–80 |

**Monthly fixed costs:**
- Twilio phone number: $1.15/month
- n8n cloud: Free tier (up to 200 executions/month) or $20/month for more
- VAPI: Pay per minute (no monthly fee)

---

## Legal Compliance (Important)

- This system calls **business phone numbers only** (B2B)
- B2B calls are exempt from most TCPA consumer protections
- Always call during business hours (9am–5pm local time)
- Honor any requests to be removed from your call list immediately
- Do NOT call numbers on the National Do Not Call Registry for consumers
