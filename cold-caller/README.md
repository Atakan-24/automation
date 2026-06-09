# AI Cold Caller — Home Services Website Sales

Automated AI cold calling system that contacts home service businesses and sells professional website packages. Sounds 100% human.

## The Offer
- **One-time:** $1,000 — Complete professional website
- **Monthly:** $50/month — Hosting, maintenance & updates
- **Target:** Plumbers, electricians, HVAC, roofers, landscapers in the USA

## How It Works
```
Google Sheets (lead list)
        ↓
  n8n triggers outbound calls
        ↓
  VAPI AI calls the business (sounds human)
        ↓
  Interested → Books 15-min Zoom demo
  Not interested → Logs result, moves to next lead
        ↓
  All results saved back to Google Sheets
```

## Tools & Costs
| Tool | Purpose | Cost |
|------|---------|------|
| VAPI | AI voice agent | ~$0.13/min |
| ElevenLabs | Realistic human voice | Free tier available |
| Twilio | US phone number | ~$1.15/month |
| n8n | Workflow automation | Free (self-hosted) |
| Google Sheets | Lead management | Free |

**Estimated cost per call:** ~$0.20–0.40 (2–3 min average)

## Files In This Package
| File | Description |
|------|-------------|
| `vapi/system-prompt.txt` | AI brain — paste directly into VAPI |
| `vapi/first-message.txt` | Opening line when call connects |
| `n8n/outbound-calls-workflow.json` | Import into n8n — makes the calls |
| `n8n/call-results-webhook.json` | Import into n8n — logs results |
| `sheets/leads-template.csv` | Copy structure into Google Sheets |
| `docs/setup-guide.md` | Step-by-step setup (start here) |
| `docs/objection-handling.md` | Full sales objection quick reference |

## Start Here
→ Open `docs/setup-guide.md`
