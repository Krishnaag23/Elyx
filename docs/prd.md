
### **Product Requirements Document (PRD): Elyx Journey Platform**

**Version:** 1.0 (Hackathon MVP)
**Author:** AI Assistant & [Krishna Agrawal](https://github.com/krishnaag23)
**Date:** Aug, 2025

#### **1. Objective (The "Why")**

Managing a high-touch, personalized health journey is complex. Critical decisions and their context are buried in months of chat logs. This creates two problems:
1.  **For the Elyx Team:** It's difficult to quickly review a member's history, understand the "why" behind past decisions, and report on progress.
2.  **For the Member:** They can feel overwhelmed and unclear about their own care plan, leading to reduced trust and adherence.

Our platform solves this by creating a single source of truth that serves both audiences: a **powerful analytical cockpit for the Elyx team** and a **clear, empowering portal for the member**.

#### **2. Target Users (The "Who")**

*   **Primary Persona: The Elyx Care Team** (e.g., Neel, the Concierge Lead). They need to quickly get up to speed on a member's journey, analyze key events, and justify care strategies.
*   **Secondary Persona: The Member** (Rohan Patel). He is data-driven but time-poor. He needs to understand his plan and trust the decisions being made for him, without having to re-read every message.

#### **3. Scope & Features (The "What")**

##### **Hackathon MVP: MUST-HAVES**

This is the core functionality required to demonstrate the vision in a 90-second video.

| Feature ID | Feature Name | User Story / Description | Acceptance Criteria (How we know it's done) | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **P1-F01** | **Data Simulation** | As a developer, I need a comprehensive, structured JSON file simulating 8 months of chat history for Rohan Patel. | - JSON file is created and validated. <br>- Contains timestamps, sender name, sender role, and message content. <br>- Adheres to all constraints from the problem statement. | **P0** |
| **P1-F02** | **Interactive Journey Timeline** | As an Elyx team member, I want to see a visual timeline of Rohan's entire journey, so I can quickly identify key events. | - A timeline is rendered on the screen using the JSON data. <br>- Key events (e.g., plan updates, test orders, member complaints) are represented as distinct, clickable nodes. <br>- Nodes are color-coded or have icons by event type. | **P0** |
| **P1-F03** | **Decision Context Modal** | As an Elyx team member, when I click on a timeline node, I want to see a modal explaining the context of that event. | - Clicking a node opens a modal. <br>- Modal displays an AI-generated summary of the event. <br>- Modal shows the exact chat message(s) that triggered the event. | **P0** |
| **P2-F01** | **Member-Facing Chatbot UI** | As Rohan, I want a simple chat interface where I can ask questions about my health journey. | - A clean, WhatsApp-style chat UI is available in the "Member View". <br>- I can type a question and press enter to submit. <br>- The app shows my question and the AI's response. | **P0** |
| **P2-F02** | **Persona-Based RAG Engine** | As Rohan, when I ask a question, I want an answer from the most relevant expert in their unique voice, so I can get a clear and trustworthy explanation. | - The backend uses RAG to find relevant context from the chat JSON. <br>- The system identifies the correct expert persona (e.g., Carla for nutrition). <br>- The LLM generates a response in that expert's tone and voice. | **P0** |
| **P1-F04** | **Episodic PDF Report** | As an Elyx team member, I want to generate a PDF summary of a specific journey episode, so I can share it internally or for review. | - A "Generate Report" button exists in the Decision Context Modal (P1-F03). <br>- Clicking it generates and downloads a clean, formatted PDF. <br>- The PDF contains the episode's trigger, friction points, outcome, and key metrics (e.g., response time). | **P1** |

##### **Stretch Goals (If we have time)**

*   **UI Polish:** Add smooth animations, loading states, and a dark mode.
*   **Full History Report:** A button to generate a PDF report of the entire 8-month journey.
*   **Internal Metrics Mock-up:** A small, static card on the Elyx dashboard showing mocked-up data for "Hours spent by coach" etc.

##### **Out of Scope for Hackathon**

*   **Real-time data ingestion (WebSockets, DB triggers).** We will explicitly state this is a future step. The JSON file is our single source of truth.
*   **User Authentication & Multiple Members.** The experience is hardcoded for Rohan Patel and the Elyx team.
*   **Direct Database Integration.** All data will be loaded from the local JSON file for speed and simplicity.

---

#### **4. Hackathon Plan of Attack (The "How & When")**

This is a high-level timeline to ensure we finish and have a compelling demo.

##### **Day 1: Build the Foundation**

*   **Goal:** Get the core data pipeline and backend logic working. Have a functional, unstyled frontend.

*   **Phase 1: Setup & Data Generation (First 3 Hours)**
    *   [ ] **Task:** Set up Next.js + Node.js project structure.
    *   [ ] **Task:** Write the detailed LLM prompt to generate the master `journey.json` file.
    *   [ ] **Task:** Generate and manually review/clean the JSON data. **This is the bedrock of the entire project.**

*   **Phase 2: Backend API & RAG Pipeline (Next 5 Hours)**
    *   [ ] **Task:** Create a simple Node.js/Express API endpoint (e.g., `/api/chat`).
    *   [ ] **Task:** Write the script to load the `journey.json`, chunk the text, create embeddings, and store them in an in-memory vector store (e.g., FAISS).
    *   [ ] **Task:** Implement the core RAG logic in the API: receive a query, retrieve context, and construct the persona-based prompt.
    *   [ ] **Task:** Test the API with a tool like Postman to ensure the persona-switching prompt works.

*   **Phase 3: Frontend Scaffolding (Remaining Time)**
    *   [ ] **Task:** Integrate D3.js or Vis.js into the Next.js app.
    *   [ ] **Task:** Create a basic component that fetches data from the `journey.json` and renders the timeline.
    *   [ ] **Task:** Make the timeline nodes clickable, opening a basic, unstyled modal with placeholder content.

**End of Day 1 Checkpoint:** We should have a working timeline and a backend API that can answer questions based on the journey data.

##### **Day 2: Build the Magic & Polish**

*   **Goal:** Build the user-facing features, make it look great, and prepare for submission.

*   **Phase 4: Feature Implementation (First 5 Hours)**
    *   [ ] **Task:** Build the React components for the member-facing Chat UI.
    *   [ ] **Task:** Connect the Chat UI to the backend RAG API. Ensure the full loop is working.
    *   [ ] **Task:** Connect the timeline modal to the backend to get the AI-generated summary.
    *   [ ] **Task:** Implement the PDF generation logic. Create a React component for the report layout and use a library like `react-pdf` to handle the export.

*   **Phase 5: UI/UX & Integration (Next 3 Hours)**
    *   [ ] **Task:** Apply CSS styling to the entire application. Make the timeline, modals, and chat look clean and professional.
    *   [ ] **Task:** Create two distinct "views" or pages: one for the Elyx team (timeline-centric) and one for Rohan (chat-centric).
    *   [ ] **Task:** Ensure the user flow is intuitive and seamless.

*   **Phase 6: Final Polish & Submission Prep (Final Hours)**
    *   [ ] **Task:** Hardcode any final values or text needed for the demo.
    *   [ ] **Task:** Final bug hunting and testing.
    *   [ ] **Task:** Record screen captures for the 90-second video.
    *   [ ] **Task:** Write the video script.
    *   [ ] **Task:** Clean up the code, add a README to the GitHub repo, and prepare the submission form.

