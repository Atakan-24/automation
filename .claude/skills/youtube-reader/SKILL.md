---
name: youtube-reader
description: YouTube video analysis skill — reads a YouTube video's transcript and analyzes it like NotebookLM. Use when the user provides a YouTube URL and wants a summary, key insights, Q&A, study guide, or deep analysis of the video content. Triggers on: YouTube links, "analyze video", "summarize YouTube", "read video", "was sagt das Video".
---

# YouTube Video Reader Skill

Analyze YouTube videos by extracting their transcript and providing NotebookLM-style insights.

## What You Can Produce

- **Summary** — concise TL;DR of the video
- **Key Topics** — main concepts covered
- **Study Guide** — structured learning notes
- **Q&A** — answer questions about the video
- **Deep Dives** — expanded explanation of a specific section
- **Key Quotes** — the most important statements

## Workflow

Work through the following steps as a todo list.

### 1. Extract the Video ID

Parse the YouTube URL provided by the user. Supported formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

Use Python to extract the ID:

```python
import re

def extract_video_id(url: str) -> str:
    patterns = [
        r'(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})',
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    raise ValueError(f"Could not extract video ID from: {url}")
```

### 2. Fetch the Transcript

Try the following methods in order. Stop at the first that succeeds.

#### Method A — youtube-transcript-api (preferred)

```bash
pip install -q youtube-transcript-api 2>&1 | tail -1
```

```python
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id: str) -> str:
    # Try requested language, then fall back to any available
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        # Prefer manually created captions
        try:
            transcript = transcript_list.find_manually_created_transcript(['de', 'en'])
        except Exception:
            transcript = transcript_list.find_generated_transcript(['de', 'en'])
        entries = transcript.fetch()
    except Exception:
        # Last resort: grab whatever is available
        entries = YouTubeTranscriptApi.get_transcript(video_id)
    
    lines = []
    for e in entries:
        start = int(e['start'])
        m, s = divmod(start, 60)
        h, m = divmod(m, 60)
        timestamp = f"[{h:02d}:{m:02d}:{s:02d}]" if h else f"[{m:02d}:{s:02d}]"
        lines.append(f"{timestamp} {e['text']}")
    return "\n".join(lines)
```

#### Method B — yt-dlp (fallback)

```bash
pip install -q yt-dlp 2>&1 | tail -1
yt-dlp --skip-download --write-auto-sub --write-sub --sub-langs "de,en" \
       --sub-format vtt --output "/tmp/yt_%(id)s" \
       "https://www.youtube.com/watch?v=VIDEO_ID" 2>&1
```

Then read and clean the `.vtt` file:

```python
import re

def parse_vtt(path: str) -> str:
    with open(path, encoding='utf-8') as f:
        text = f.read()
    # Remove WEBVTT header, timestamps, tags
    text = re.sub(r'WEBVTT.*?\n\n', '', text, flags=re.DOTALL)
    text = re.sub(r'\d{2}:\d{2}[\d:.]* --> .*\n', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    lines = [l.strip() for l in text.splitlines() if l.strip() and not l.strip().isdigit()]
    # Deduplicate consecutive identical lines (common in auto-captions)
    deduped = []
    for line in lines:
        if not deduped or line != deduped[-1]:
            deduped.append(line)
    return "\n".join(deduped)
```

#### Method C — yt-dlp with cookies (for cloud environments)

Cloud environments (AWS, GCP, Azure) have their IPs blocked by YouTube. If Methods A and B fail with IP-block or bot-detection errors, ask the user for a `cookies.txt` file:

> "YouTube blockiert direkte Anfragen aus Cloud-Servern. Bitte exportiere deine YouTube-Cookies:
> 1. Installiere die Browser-Extension **'Get cookies.txt LOCALLY'**
> 2. Gehe auf youtube.com (eingeloggt)
> 3. Exportiere die Cookies → schick mir den Dateiinhalt
> Oder: Öffne das Video → `...` → **'Transkript öffnen'** → kopiere den Text direkt hier rein."

Once cookies are provided, save them to `/tmp/yt_cookies.txt` and retry:

```bash
yt-dlp --no-check-certificate --cookies /tmp/yt_cookies.txt \
  --skip-download --write-auto-sub --write-sub --sub-langs "de,en" \
  --sub-format vtt --output "/tmp/yt_%(id)s" \
  "https://www.youtube.com/watch?v=VIDEO_ID" 2>&1
```

Also works with youtube-transcript-api using a custom http_client with cookies:

```python
import requests
from youtube_transcript_api import YouTubeTranscriptApi

session = requests.Session()
# Load cookies from Netscape cookies.txt
import http.cookiejar
jar = http.cookiejar.MozillaCookieJar('/tmp/yt_cookies.txt')
jar.load()
session.cookies = jar

ytt = YouTubeTranscriptApi(http_client=session)
```

#### If all methods fail (including cookies)

Tell the user the video has no available captions and suggest:
- Enabling auto-generated captions on the video
- Providing a manual transcript by copying from YouTube's built-in transcript viewer (`...` → "Transkript öffnen")
- Trying a different video

### 3. Fetch Video Metadata (optional but helpful)

Use yt-dlp to get the title, uploader, and duration without downloading the video:

```bash
yt-dlp --skip-download --print "%(title)s|%(uploader)s|%(duration_string)s|%(upload_date)s" \
       "https://www.youtube.com/watch?v=VIDEO_ID" 2>/dev/null
```

Parse the output as `title|uploader|duration|date`.

### 4. Analyze the Transcript

After obtaining the full transcript text, analyze it using your own reasoning. The transcript may be very long — if so, process it in logical chunks (by timestamp blocks of ~5 minutes).

Perform the analysis the user requested. If no specific request was made, provide the **Default Analysis** below.

#### Default Analysis (when no specific output is requested)

Produce the following sections in German if the video is in German, otherwise in the language of the transcript:

---

## 📺 [Video Title]
*[Uploader] · [Duration] · [Upload Date]*

---

### TL;DR
2–4 sentences covering the core message.

### Hauptthemen
Bullet list of the 5–10 key topics, each with a 1-sentence explanation.

### Kernaussagen
The 5–8 most important statements or insights from the video, as direct quotes or close paraphrases with timestamps.

### Zusammenfassung
A flowing 3–5 paragraph summary that covers the arc of the video: introduction, development, conclusion.

### Lernpunkte / Key Takeaways
What a viewer should remember or act on after watching.

---

#### Specific Output Modes

| User asks for | Produce |
|---|---|
| "Zusammenfassung" / "summary" | TL;DR + Zusammenfassung sections only |
| "Study guide" / "Lernzettel" | Hauptthemen + structured bullet notes per topic |
| "Fragen" / "Q&A" | Answer the specific questions using the transcript |
| "Zitate" / "quotes" | Kernaussagen with full timestamps |
| "Kapitel" / "chapters" | Group transcript by logical sections with headings |
| "Erkläre [topic]" | Deep-dive explanation of that topic from the video |

### 5. Handle Long Transcripts

If the transcript exceeds ~15,000 words:
- Process it in segments of ~5 minutes each
- Summarize each segment first
- Then synthesize the segment summaries into the final output
- Note to the user that the video is long and the analysis covers all segments

### 6. Answer Follow-up Questions

After delivering the initial analysis, stay in context. The user may ask follow-up questions about the video. Use the transcript you already fetched to answer them precisely, citing timestamps where relevant.

If the user asks a question and no transcript is loaded yet, ask them to provide the YouTube URL first.

## Error Handling

| Error | Action |
|---|---|
| No captions available | Inform user, suggest alternatives |
| Private / age-restricted video | Inform user, yt-dlp cannot access it |
| Invalid URL | Ask user for a valid YouTube URL |
| Transcript in unexpected language | Use it anyway, note the language |
| Network error | Retry once, then report the error |

## Example Invocations

- `/youtube-reader https://youtu.be/dQw4w9WgXcQ`
- `/youtube-reader — kannst du dieses Video für mich zusammenfassen? [URL]`
- "Lies mir dieses YouTube Video: [URL]"
- "Was sagt der Sprecher bei Minute 5?" (after URL was given)

## Wrap Up

End every analysis with:

> *Analyse basiert auf dem automatischen Transkript des Videos. Zeitstempel beziehen sich auf die Originalaufnahme.*

Then ask the user: "Möchtest du tiefer in ein bestimmtes Thema eintauchen oder hast du Fragen zum Video?"
