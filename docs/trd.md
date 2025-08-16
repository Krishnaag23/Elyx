### **Technical Requirements Document (TRD): Elyx Journey Platform**

**Version:** 1.0 (Hackathon MVP)
**Author:** AI Architect
**Date:** Aug, 2025

#### **1. System Architecture**

The system follows a monolithic Next.js architecture, leveraging its integrated backend (API routes) for simplicity and rapid development. This approach minimizes setup overhead, allowing us to focus on feature implementation.

##### **1.1. High-Level Architecture Diagram**

```
+------------------+      (HTTPS)      +-----------------------------+      (API Calls)      +------------------+
|                  |                   |                             |                       |                  |
|  Client Browser  | <---------------> |   Next.js / Vercel Server   | --------------------> |    OpenAI API    |
| (React Frontend) |                   |                             |                       | (LLM & Embeddings) |
|                  |                   | +-------------------------+ |                       +------------------+
+------------------+                   | |                         | |
                                       | |   Frontend Components   | |
                                       | | (Timeline, Chat, PDF)   | |
                                       | +-------------------------+ |
                                       | |                         | |
                                       | |      Backend Logic      | |
                                       | |     (API Routes)        | |
                                       | +-----------+-------------+ |
                                       |             |               |
                                       | (In-Memory) | Loads on Start|
                                       |             v               |
                                       | +-----------+-------------+ |
                                       | |   FAISS Vector Store    | |
                                       | +-----------+-------------+ |
                                       |             |               |
                                       |             v               |
                                       | |      journey.json       | |
                                       | +-------------------------+ |
                                       +-----------------------------+
```

##### **1.2. Component Breakdown**

*   **Frontend (Next.js/React):** A client-side application responsible for all rendering. It fetches data from its own backend API routes.
*   **Backend (Next.js API Routes):** A Node.js/Express-like environment that serves data, handles AI logic, and orchestrates calls to external services (OpenAI).
*   **Data Store (Hackathon):** A static `journey.json` file. This is our "single source of truth." It's loaded into the server's memory at startup for maximum performance.
*   **Vector Store (Hackathon):** An in-memory FAISS index (`faiss-node`) managed by the backend. It's populated on server startup by embedding the content of `journey.json`.
*   **External Services:** OpenAI API for chat completions and text embeddings.

---

#### **2. Data Layer**

##### **2.1. Data Storage Strategy: JSON File vs. PostgreSQL**

*   **Hackathon Approach: `journey.json`**
    *   **Rationale:** For a 2-day hackathon, speed is paramount. A database introduces significant overhead: setup, schema migrations, ORM configuration, and connection management. A single JSON file is zero-setup, easily version-controlled with Git, and performant enough for a single-user demo when loaded into memory.
    *   **Benefit:** We can spend 100% of our time on building features, not managing infrastructure.
*   **Production Consideration: PostgreSQL with `pgvector`**
    *   **Rationale:** In a real-world scenario, we would need transactional integrity, scalability to millions of messages, and the ability to perform complex relational queries (e.g., "show me all messages from nutritionists related to members with high ApoB levels"). `pgvector` allows us to store embeddings directly alongside the data, simplifying the RAG architecture.
    *   **Benefit:** Scalability, data integrity, and powerful querying capabilities.

##### **2.2. Schema: `journey.json`**

The file will be an array of event objects, chronologically sorted.

```json
[
  {
    "eventId": "evt_001",
    "timestamp": "2025-09-01T10:00:00Z",
    "sender": "Rohan Patel",
    "senderRole": "Member",
    "message": "Hi team, I've just signed up. Excited to get started.",
    // for below things we would need some advanced NLP let's see if we can do in TS or leave for now .
    "eventType": "Communication", // 'Communication', 'PlanUpdate', 'TestResult', 'InternalNote'
    "metadata": null
  },
  {
    "eventId": "evt_002",
    "timestamp": "2025-09-15T14:30:00Z",
    "sender": "Dr. Warren",
    "senderRole": "Medical Strategist",
    "message": "Based on your initial intake and family history, I've ordered a full diagnostic panel, including an advanced lipid test.",
    "eventType": "PlanUpdate",
    "metadata": {
      "decision": "Order Full Diagnostic Panel",
      "rationale": "Family history of heart disease.",
      "relatedTests": ["OGTT", "Lipid Panel", "ApoB"]
    }
  }
]
```

##### **2.3. Data Generation: LLM Prompt Strategy**

Generating 8 months of realistic, coherent chat history is a core task. We will use a powerful LLM (e.g., GPT-4-Turbo) with a chained-prompting approach.

1.  **Master System Prompt:** A detailed prompt that establishes the context for the entire generation.
2.  **Iterative Generation:** We will prompt the LLM to generate the conversation month-by-month, feeding the output of the previous month as context for the next. This prevents the LLM from losing track of the narrative thread.

**Master System Prompt (Example Snippet):**
```
You are an AI data generator. Your task is to simulate an 8-month long conversation history between a member, Rohan Patel, and his care team at Elyx.

**OUTPUT FORMAT (CRITICAL):**
Generate a valid JSON array of objects. Each object must have the following keys: eventId, timestamp, sender, senderRole, message, eventType, metadata.

**CONTEXT:**
- **Member:** Rohan Patel (46, M, FinTech Sales Head, Singapore). Goal: Reduce heart disease risk. Personality: Analytical, driven, time-constrained.
- **Elyx Team:**
  - Ruby (Concierge): Empathetic, organized.
  - Dr. Warren (Medical Strategist): Authoritative, scientific.
  - Advik (Performance Scientist): Analytical, data-driven.
  - Carla (Nutritionist): Practical, educational.
  - ... (and others)
- **Constraints & Events to Include:**
  - Diagnostic tests every 3 months.
  - Member travels 1 week/month.
  - Exercise plan updates every 2 weeks.
  - Member adherence is ~50%, requiring plan adjustments.
  - Member initiates ~5 curious conversations per week.
  - The member has one chronic condition: borderline high blood pressure.

**YOUR TASK for this run:**
Generate the conversation for Month 1 (September 2025). Start with Rohan's onboarding message on September 1st. Ensure you include the initial consultation and the ordering of the first diagnostic panel.

[Previous month's conversation will be inserted here in subsequent runs]
```

---

#### **3. Backend Technical Deep Dive (API Routes)**

##### **3.1. Technologies**
*   **Runtime:** Node.js
*   **Vector Store:** `faiss-node` (lightweight, powerful, in-memory)
*   **Embeddings:** OpenAI's `text-embedding-3-small` (cost-effective, high performance)
*   **LLM:** OpenAI's `gpt-4o-mini` or similar (fast, intelligent, cheaper than full GPT-4)

##### **3.2. RAG Pipeline Initialization (On Server Start)**
1.  Read and parse `journey.json` into memory.
2.  **Chunking Strategy:** Group messages into overlapping chunks of 3-5 messages. This preserves local conversational context, which is crucial for understanding causality. A single message is often meaningless without the messages before and after it.
3.  For each chunk, create a text representation and generate an embedding via the OpenAI API.
4.  Store these embeddings and their corresponding original text chunks in the FAISS index.

##### **3.3. API Endpoints**

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/journey` | Fetches the entire journey data to render the timeline. | `{}` | `journey.json` content |
| `POST` | `/api/chat` | The core RAG chatbot endpoint for Rohan. | `{ "query": "Why am I taking this med?" }` | `{ "response": "Carla says...", "persona": "Nutritionist" }` |
| `POST` | `/api/summarize` | Generates a summary for a specific event or time range for the context modal. | `{ "eventIds": ["evt_123", "evt_124"] }` | `{ "summary": "Rohan expressed concern..." }` |

---

#### **4. Frontend Technical Deep Dive**

##### **4.1. Technologies**
*   **Framework:** Next.js 14+ (App Router)
*   **UI Components:** Shadcn/UI or MUI (for pre-built, accessible components to save time).
*   **State Management:** Zustand. Simple, minimal boilerplate compared to Redux, perfect for managing global state like the current view (Elyx/Rohan).
*   **Visualization:** `vis-timeline-react`. A declarative wrapper around Vis.js, ideal for quickly creating a rich, interactive timeline.
*   **PDF Generation:** `react-pdf`. Allows us to define the PDF structure using React components, making the layout process highly intuitive.

##### **4.2. Feature Implementation Details**

*   **Timeline Graph Construction:**
    1.  The frontend fetches the full journey data from `/api/journey`.
    2.  A utility function `transformDataForTimeline(data)` will map the JSON array to the format required by `vis-timeline-react`:
        *   It will iterate through the JSON. For events with `eventType: "PlanUpdate"` or events containing keywords like "frustrated", "confused", "goal achieved", it will create a distinct timeline item.
        *   Other `eventType: "Communication"` messages can be grouped into a background range or omitted from the main view to reduce clutter, accessible via the modal.
        *   Items will be assigned a `className` based on `senderRole` for CSS styling (e.g., `member-event`, `elyx-event`).

*   **PDF Generation Flow:**
    1.  The user clicks "Generate Report" on a modal.
    2.  The relevant event data is passed to a dedicated `<EpisodeReportLayout>` React component.
    3.  This component is styled with plain CSS-in-JS and lays out the titles, text, and metrics. It does NOT render to the DOM.
    4.  `react-pdf`'s `<PDFDownloadLink>` component is used, which takes `<EpisodeReportLayout>` as its child. It handles the rendering of the component to a PDF blob and triggers the browser download. This is an elegant, client-side solution that requires no backend processing.

*   **Persona-Based Chatbot UI:**
    1.  The UI will be a standard chat component managing a state array of messages: `const [messages, setMessages] = useState([])`.
    2.  When the user sends a message, it's immediately added to the state with a `status: 'pending'` flag.
    3.  A `fetch` call is made to `POST /api/chat`.
    4.  The API response includes the text and the persona. The UI can use the persona to display the correct avatar (e.g., Carla's picture) next to the response, reinforcing the persona-based interaction.
    5.  The response message replaces the pending message in the state. Streaming responses via Server-Sent Events (SSE) would be a stretch goal for a "ChatGPT-like" typing effect.
