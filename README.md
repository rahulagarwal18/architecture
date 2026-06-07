# Enterprise Data Platform & UDAIP Capabilities Architecture

An interactive, high-fidelity visual dashboard representing:
1. **L1 - GCP Enterprise Data Platform Architecture** (Changi Airport Group Transformation)
2. **L2 - UDAIP Platform Detailed Capabilities**

Built with premium dark-themed styling, interactive visual flows, dynamic SVG-based data-flow simulation, a detailed inspector side panel, and search highlights.

## Features
- **Dynamic Interactive Grid**: View and interact with detailed components of the GCP and UDAIP frameworks.
- **Component Inspector Panel**: Click on any node to view detailed descriptions, technologies, input/output data, and role in the platform.
- **Data Flow Simulation (L1)**: Toggle real-time animated flows of data moving from Sources through Ingestion and Storage/Processing layers.
- **Real-time Search Filter**: Type any keyword (e.g. `Gemini`, `Looker`, `Dataflow`) to filter and highlight matching architecture cards.
- **Offline / Portable**: SPA built with vanilla HTML/CSS/JS, allowing it to be run instantly by opening `index.html` in any browser.

## File Structure
- [index.html](index.html) - Structural framework, navigation, and sidebar drawer container.
- [styles.css](styles.css) - Modern dark mode, glassmorphism design variables, responsive positioning, and animMotion flows.
- [app.js](app.js) - Complete datasets of GCP/UDAIP architectures, card renderer, search logic, and inspector triggers.
