# Voice Synthesis Studio

A modern, high-performance Text-to-Speech (TTS) web application built with Next.js and the Web Speech API. Transform your text into natural-sounding speech with support for multiple languages and voices.

## Features

- 🎙️ **Text-to-Speech Conversion** - Convert any text into natural-sounding speech
- 🌍 **Multi-Language Support** - Access voices in multiple languages and accents
- 🎨 **Modern UI** - Beautiful, responsive interface with dark theme
- 🔊 **Voice Selection** - Choose from available system voices with preview functionality
- 📝 **Quick Suggestions** - Pre-built text templates for common use cases
- 📊 **Audio Visualization** - Real-time visual feedback during playback
- ⚡ **High Performance** - Built with Next.js 15 and React 19
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd voice-synthesis
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Usage

1. **Enter Text**: Type or paste your text into the text area
2. **Select Voice**: Choose from available voices in the dropdown menu
3. **Preview Voice**: Click the play button next to any voice to preview it
4. **Quick Start**: Use the suggestion badges to quickly fill in example text
5. **Play**: Click the play/pause button to start or stop speech synthesis

## Browser Compatibility

This application uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), which is supported in:

- Chrome/Edge (full support)
- Safari (full support)
- Firefox (partial support)

Note: Voice availability depends on your operating system and browser. Different systems may have different voices installed.

## Project Structure

```
voice-synthesis/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main TTS application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional stylesheets
```

## Development

The project uses:

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible UI components
- **React Hook Form** and **Zod** for form validation (if needed)

---

Built with ❤️ using Next.js and the Web Speech API
