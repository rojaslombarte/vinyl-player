# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A vanilla JavaScript vinyl record player web application with animated turntable visuals and audio playback controls. No build tools or dependencies required.

## Running the App

Open `index.html` directly in a browser, or serve locally:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000
```

Note: Some browsers block audio from `file://` URLs, so a local server may be needed for full functionality.

## Architecture

**Single-page app with three files:**
- `index.html` - DOM structure for turntable, controls, and playlist
- `styles.css` - CSS variables, keyframe animations, responsive layout
- `app.js` - Audio playback logic, playlist state, event handlers

**Key state variables in app.js:**
- `tracks[]` - Array of track objects (id, title, artist, src, albumArt)
- `currentIndex` - Currently selected track (-1 if none)
- `isPlaying` - Playback state, synced with HTML5 Audio events

**Animation system:**
- Vinyl spin: CSS `animation: spin 1.8s linear infinite` controlled by `.spinning` class
- Tonearm: CSS transition on `transform: rotate()`, tracks progress via `--tracking-angle` custom property
- Play state toggles CSS classes: `vinylDisc.spinning`, `tonearmAssembly.engaged`, `powerLed.active`

**Audio handling:**
- Uses HTML5 `<audio>` element (`#audioPlayer`)
- Streams from URLs or plays local files via `URL.createObjectURL()`
- Events: `play`, `pause`, `timeupdate`, `durationchange`, `ended`, `error`
