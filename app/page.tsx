import { TextToSpeechClient } from "@/components/TextToSpeechClient";

export default function TextToSpeechApp() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
			<div className="container mx-auto px-4 py-16 lg:py-20">
				{/* Header - Server Rendered */}
				<div className="text-center mb-16 lg:mb-20">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 lg:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
						Voice Synthesis Studio
					</h1>
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 lg:mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
						Text-to-Speech Platform
					</h2>
					<p className="text-base lg:text-lg text-gray-400 mb-2 max-w-2xl mx-auto">
						Powered by high performance State Space Model technology.
					</p>
					<p className="text-base lg:text-lg text-gray-400 mb-12 lg:mb-16 max-w-2xl mx-auto">
						Purpose-built for developers.
					</p>
				</div>

				{/* Client Component - Interactive Features */}
				<TextToSpeechClient />
			</div>
		</div>
	);
}
