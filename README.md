<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧠 Life OS Autonomous Strategist

**An AI-powered personal operating system that plans, reasons, and executes complex goals through autonomous decision-making**

[![Built with Gemini 3 Pro](https://img.shields.io/badge/Gemini-3%20Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

[View in AI Studio](https://ai.studio/apps/drive/126vLMNotixOUWYHyFMBAC1AVGl3iL11_?fullscreenApplet=true) • [Demo](#-features) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

Life OS is an autonomous operations agent built on **Gemini 3 Pro** that transforms how you manage personal and professional goals. Unlike traditional productivity tools, Life OS thinks ahead, self-corrects, and adapts to your workflow through advanced reasoning capabilities and long-term memory.

### 🎯 Key Capabilities

- **🤖 Autonomous Strategy Planning** - AI agent that breaks down complex goals into actionable steps with reasoning transparency
- **🧩 Intelligent Data Ingestion** - Natural language processing to classify tasks, events, and notes automatically
- **📊 Dynamic Daily Briefing** - Context-aware scheduling based on your stored items and priorities
- **🎨 Visual System Architecture** - Generate and edit architectural blueprints using Gemini 3 Pro Image
- **🎥 Process Simulation** - Create 3D animated videos visualizing your workflow using Veo 3.1
- **🎤 Voice Diagnostics** - Audio-based system analysis for hands-free interaction
- **🔄 Multi-Mode Operations** - Adaptive contexts: Student, Business, Design, and General Life

---

## 🚀 Features

### 1. **Strategy Builder** (Autonomous Agent)
The core reasoning engine powered by Gemini 3 Pro that:
- Accepts long-term goals and contextual constraints
- Generates step-by-step reasoning chains
- Identifies potential risks and mitigation strategies
- Provides transparent thought process for each decision

### 2. **Global Capture System**
Universal input mechanism that intelligently:
- Parses natural language into structured data
- Auto-classifies content as tasks, events, or notes
- Assigns priority levels (LOW/MED/HIGH)
- Tags and organizes by industry mode

### 3. **Smart Dashboard**
Real-time overview featuring:
- Time-aware status indicators (Active Day, Evening Reflection, Resting)
- AI-generated daily schedule with time estimates
- Priority-sorted item lists filtered by active mode
- Quick stats and actionable insights

### 4. **System Visualizer**
Advanced visual generation tools:
- **Blueprint Generator** - Create technical diagrams from text descriptions (1K/2K/4K resolution)
- **Visual Editor** - Modify existing images with natural language prompts using Gemini 2.5 Flash Image
- **Video Simulator** - Generate 720p animated workflow simulations via Veo 3.1

### 5. **Voice Diagnostic Interface**
Audio-driven analysis system:
- Microphone-based input capture
- System pattern recognition
- Failure loop identification
- Honest, actionable feedback

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **AI Engine** | Gemini 3 Pro Preview | Strategic planning & reasoning |
| **AI Models** | Gemini 3 Flash Preview | Fast data processing & classification |
| **Image Generation** | Gemini 3 Pro Image Preview | High-quality blueprint creation |
| **Image Editing** | Gemini 2.5 Flash Image | Visual modification |
| **Video Generation** | Veo 3.1 Fast Generate | Process simulation videos |
| **Frontend** | React 19.2 + TypeScript 5.8 | UI framework |
| **Build Tool** | Vite 6.2 | Development server |
| **AI SDK** | @google/genai 1.40.0 | Gemini API integration |
| **Storage** | LocalStorage | Client-side persistence |

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-os-autonomous-strategist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Open `.env.local` and add your Gemini API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📚 Usage Guide

### Quick Start Workflow

1. **Select Your Mode**
   - Choose from STUDENT, BUSINESS, DESIGN, or LIFE mode in the header
   - Mode affects how the AI interprets and organizes your input

2. **Capture Information**
   - Use the bottom capture bar to add tasks, events, or notes
   - Type naturally - AI will classify and structure automatically

3. **Build a Strategy**
   - Navigate to "STRATEGIST" section
   - Enter a long-term goal
   - Provide context (budget, time, resources)
   - Let the agent generate a detailed plan with reasoning steps

4. **View Your Dashboard**
   - Check auto-generated daily schedule
   - Review sorted items by priority
   - Get creative tips and actionable insights

5. **Visualize Systems**
   - Go to "VISUALIZER" to create architectural diagrams
   - Generate blueprints or simulate processes as videos
   - Edit visuals with natural language commands

### Example Inputs

**For Strategy Builder:**
```
Goal: Launch a SaaS product in 3 months
Context: $5000 budget, 2 hours daily, experienced developer
```

**For Global Capture:**
```
"Finish the investor pitch deck by Friday - high priority"
"Team standup meeting tomorrow at 10am"
"Research competitor pricing models"
```

---

## 🏗️ Architecture

### Project Structure

```
life-os-autonomous-strategist/
├── components/
│   ├── Dashboard.tsx          # Main overview panel
│   ├── EnginePanel.tsx        # Strategy builder interface
│   ├── GlobalCapture.tsx      # Universal input system
│   ├── Header.tsx             # Navigation & mode selector
│   ├── Visualizer.tsx         # Image/video generation
│   └── VoiceDiagnostic.tsx    # Voice-based analysis
├── services/
│   └── gemini.ts              # Gemini API integration
├── types.ts                    # TypeScript definitions
├── App.tsx                     # Root component
├── index.tsx                   # Entry point
├── vite.config.ts             # Build configuration
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

### Data Flow

```
User Input → GlobalCapture → Gemini 3 Flash (classify) 
          → IngestedItem → LocalStorage → Dashboard

Strategy Request → EnginePanel → Gemini 3 Pro (reason) 
                → AgentPlan → UI Display

Visual Request → Visualizer → Gemini 3 Pro Image / Veo 3.1 
              → Base64/Video URL → Canvas Display
```

---

## 🎨 Industry Modes

| Mode | Identifier | Use Case | Example Items |
|------|-----------|----------|---------------|
| **STUDENT** | ACADEMIC | Course management, assignments | "Study for NETS1030 midterm - HIGH" |
| **BUSINESS** | ECOMMERCE | Sales tracking, CRM, inventory | "Follow up with client about Q1 proposal" |
| **DESIGN** | CREATIVE | Projects, inspiration, clients | "Revise logo mockups for Brand X" |
| **LIFE** | GENERAL | Personal tasks, habits, goals | "Book dentist appointment for next week" |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Your Gemini API key from AI Studio | ✅ Yes |

### Build Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 API Reference

### Core Functions

#### `planAutonomousStrategy(goal: string, context: string)`
Generates a strategic plan using Gemini 3 Pro's reasoning capabilities.

**Returns:**
```typescript
interface AgentPlan {
  goalSummary: string;
  reasoningSteps: ReasoningStep[];
  finalStrategy: string;
  potentialRisks: string[];
}
```

#### `parseUnifiedInput(input: string, mode: IndustryMode)`
Classifies and structures natural language input.

**Returns:**
```typescript
interface IngestedItem {
  type: 'TASK' | 'EVENT' | 'NOTE';
  content: string;
  metadata: {
    priority: 'LOW' | 'MED' | 'HIGH';
    tags?: string[];
  }
}
```

#### `generateDailyBrief(items: IngestedItem[], mode: IndustryMode)`
Creates a personalized daily schedule from stored items.

#### `generateSystemVisual(prompt: string, size: ImageSize)`
Produces architectural blueprints using Gemini 3 Pro Image.

#### `simulateVideo(prompt: string)`
Creates animated process simulations via Veo 3.1.

---

## 🤝 Contributing

This project was developed for the **Gemini 3 Hackathon 2025**. Contributions, issues, and feature requests are welcome!

### Development Guidelines

1. Follow the existing TypeScript patterns
2. Maintain the simple, direct tone in UI copy
3. Test with multiple industry modes
4. Ensure API key security (never commit `.env.local`)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the powerful AI models and API
- **AI Studio** - For the development platform
- **React & Vite** - For the excellent developer experience

---

## 📞 Support

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Documentation**: Check [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- **Community**: Share your Life OS workflows and customizations

---

<div align="center">

**Built with ❤️ for the Gemini 3 Hackathon 2026**

*Empowering autonomous productivity through AI*

