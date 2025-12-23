"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import AudioVisualization from "@/components/AudioVisualization";
import { suggestions, type Suggestion } from "@/lib/constants";

export const TextToSpeechClient = () => {
	const [text, setText] = useState("");
	const [isPlaying, setIsPlaying] = useState(false);
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] = useState<string>("");
	const [speechSynthesis, setSpeechSynthesis] =
		useState<SpeechSynthesis | null>(null);
	const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
	const [visibleSuggestions, setVisibleSuggestions] = useState(3);

	useEffect(() => {
		const updateVisibleSuggestions = () => {
			const width = window.innerWidth;
			if (width >= 1280) {
				// xl
				setVisibleSuggestions(5);
			} else if (width >= 1024) {
				// lg
				setVisibleSuggestions(4);
			} else if (width >= 768) {
				// md
				setVisibleSuggestions(3);
			} else if (width >= 640) {
				// sm
				setVisibleSuggestions(2);
			} else {
				setVisibleSuggestions(1);
			}
		};

		updateVisibleSuggestions();
		window.addEventListener("resize", updateVisibleSuggestions);
		return () => window.removeEventListener("resize", updateVisibleSuggestions);
	}, []);

	const maxIndex = Math.max(0, suggestions.length - visibleSuggestions);

	useEffect(() => {
		if (typeof globalThis !== "undefined" && "speechSynthesis" in globalThis) {
			setSpeechSynthesis(globalThis.speechSynthesis);

			const loadVoices = () => {
				const availableVoices = globalThis.speechSynthesis.getVoices();
				const sortedVoices = availableVoices.toSorted((a, b) => {
					if (a.lang !== b.lang) {
						return a.lang.localeCompare(b.lang);
					}
					return a.name.localeCompare(b.name);
				});
				setVoices(sortedVoices);

				if (sortedVoices.length > 0 && !selectedVoice) {
					const englishVoice =
						sortedVoices.find(voice => voice.lang.startsWith("en")) ||
						sortedVoices[0];
					setSelectedVoice(englishVoice.name);
				}
			};

			loadVoices();
			globalThis.speechSynthesis.onvoiceschanged = loadVoices;
			setTimeout(loadVoices, 100);
		}

		// Cleanup: cancel any ongoing speech synthesis when component unmounts
		return () => {
			if (
				typeof globalThis !== "undefined" &&
				"speechSynthesis" in globalThis
			) {
				globalThis.speechSynthesis.cancel();
			}
		};
	}, [selectedVoice]);

	// Handle browser reload - cancel speech synthesis before page unloads
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (
				typeof globalThis !== "undefined" &&
				"speechSynthesis" in globalThis
			) {
				globalThis.speechSynthesis.cancel();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("pagehide", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("pagehide", handleBeforeUnload);
		};
	}, []);

	const handlePlay = () => {
		if (!speechSynthesis || !text.trim()) return;

		if (isPlaying) {
			speechSynthesis.cancel();
			setIsPlaying(false);
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		const voice = voices.find(v => v.name === selectedVoice);

		if (voice) {
			utterance.voice = voice;
		}

		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 1;

		utterance.onstart = () => setIsPlaying(true);
		utterance.onend = () => {
			setIsPlaying(false);
		};
		utterance.onerror = () => {
			setIsPlaying(false);
		};

		speechSynthesis.speak(utterance);
	};

	const handleSuggestionClick = (suggestion: Suggestion) => {
		// Stop any ongoing playback when selecting a new suggestion
		if (speechSynthesis && isPlaying) {
			speechSynthesis.cancel();
			setIsPlaying(false);
		}
		setText(suggestion.content);
	};

	const nextSuggestions = () => {
		setCurrentSuggestionIndex(prev => Math.min(prev + 1, maxIndex));
	};

	const prevSuggestions = () => {
		setCurrentSuggestionIndex(prev => Math.max(prev - 1, 0));
	};

	const getCountryFlag = (lang: string): string => {
		const countryFlags: { [key: string]: string } = {
			"en-US": "🇺🇸",
			"en-GB": "🇬🇧",
			"en-AU": "🇦🇺",
			"en-CA": "🇨🇦",
			"en-IE": "🇮🇪",
			"en-ZA": "🇿🇦",
			"en-IN": "🇮🇳",
			"en-NZ": "🇳🇿",
			"fr-FR": "🇫🇷",
			"fr-CA": "🇨🇦",
			"fr-BE": "🇧🇪",
			"fr-CH": "🇨🇭",
			"es-ES": "🇪🇸",
			"es-MX": "🇲🇽",
			"es-AR": "🇦🇷",
			"es-CO": "🇨🇴",
			"es-CL": "🇨🇱",
			"de-DE": "🇩🇪",
			"de-AT": "🇦🇹",
			"de-CH": "🇨🇭",
			"it-IT": "🇮🇹",
			"pt-PT": "🇵🇹",
			"pt-BR": "🇧🇷",
			"nl-NL": "🇳🇱",
			"nl-BE": "🇧🇪",
			"sv-SE": "🇸🇪",
			"da-DK": "🇩🇰",
			"no-NO": "🇳🇴",
			"fi-FI": "🇫🇮",
			"pl-PL": "🇵🇱",
			"cs-CZ": "🇨🇿",
			"sk-SK": "🇸🇰",
			"hu-HU": "🇭🇺",
			"ro-RO": "🇷🇴",
			"bg-BG": "🇧🇬",
			"hr-HR": "🇭🇷",
			"sl-SI": "🇸🇮",
			"et-EE": "🇪🇪",
			"lv-LV": "🇱🇻",
			"lt-LT": "🇱🇹",
			"el-GR": "🇬🇷",
			"tr-TR": "🇹🇷",
			"ru-RU": "🇷🇺",
			"uk-UA": "🇺🇦",
			"ja-JP": "🇯🇵",
			"ko-KR": "🇰🇷",
			"zh-CN": "🇨🇳",
			"zh-TW": "🇹🇼",
			"zh-HK": "🇭🇰",
			"th-TH": "🇹🇭",
			"vi-VN": "🇻🇳",
			"hi-IN": "🇮🇳",
			"bn-BD": "🇧🇩",
			"ur-PK": "🇵🇰",
			"ta-IN": "🇮🇳",
			"te-IN": "🇮🇳",
			"ml-IN": "🇮🇳",
			"kn-IN": "🇮🇳",
			"gu-IN": "🇮🇳",
			"pa-IN": "🇮🇳",
			"mr-IN": "🇮🇳",
			"or-IN": "🇮🇳",
			"as-IN": "🇮🇳",
			"ar-SA": "🇸🇦",
			"ar-EG": "🇪🇬",
			"ar-AE": "🇦🇪",
			"ar-MA": "🇲🇦",
			"he-IL": "🇮🇱",
			"fa-IR": "🇮🇷",
			"sw-KE": "🇰🇪",
			"am-ET": "🇪🇹",
			"zu-ZA": "🇿🇦",
			"af-ZA": "🇿🇦",
			"id-ID": "🇮🇩",
			"ms-MY": "🇲🇾",
			"tl-PH": "🇵🇭"
		};

		return countryFlags[lang] || countryFlags[lang.split("-")[0]] || "🌐";
	};

	const getVoiceDescription = (voice: SpeechSynthesisVoice): string => {
		const name = voice.name.toLowerCase();
		const lang = voice.lang.toLowerCase();

		if (name.includes("neural") || name.includes("premium")) {
			return "High-quality neural voice with natural intonation and expression";
		} else if (name.includes("wavenet") || name.includes("studio")) {
			return "Studio-quality voice with advanced AI processing";
		} else if (
			name.includes("female") ||
			name.includes("woman") ||
			name.includes("sophia") ||
			name.includes("emma") ||
			name.includes("olivia") ||
			name.includes("aria") ||
			name.includes("jenny") ||
			name.includes("hazel")
		) {
			return "Clear, professional feminine voice perfect for narration and presentations";
		} else if (
			name.includes("male") ||
			name.includes("man") ||
			name.includes("david") ||
			name.includes("ryan") ||
			name.includes("brian") ||
			name.includes("guy") ||
			name.includes("mark") ||
			name.includes("daniel")
		) {
			return "Authoritative masculine voice ideal for professional content";
		} else if (lang.includes("en-gb") || lang.includes("en-au")) {
			return "Sophisticated English accent with clear articulation";
		} else if (lang.includes("en-us")) {
			return "Standard American English voice with neutral accent";
		} else if (lang.includes("fr")) {
			return "Elegant French voice with authentic pronunciation";
		} else if (lang.includes("es")) {
			return "Warm Spanish voice with natural rhythm and flow";
		} else if (lang.includes("de")) {
			return "Precise German voice with clear consonants";
		} else if (lang.includes("it")) {
			return "Melodic Italian voice with expressive intonation";
		} else if (lang.includes("pt")) {
			return "Rich Portuguese voice with smooth delivery";
		} else if (lang.includes("ja")) {
			return "Authentic Japanese voice with proper pitch accent";
		} else if (lang.includes("ko")) {
			return "Natural Korean voice with correct honorific pronunciation";
		} else if (lang.includes("zh")) {
			return "Clear Chinese voice with accurate tonal pronunciation";
		} else if (lang.includes("ar")) {
			return "Fluent Arabic voice with proper classical pronunciation";
		} else if (lang.includes("hi")) {
			return "Native Hindi voice with authentic accent and rhythm";
		} else if (lang.includes("ru")) {
			return "Rich Russian voice with proper stress patterns";
		} else {
			return `Natural voice with clear pronunciation`;
		}
	};

	const testVoice = (voice: SpeechSynthesisVoice) => {
		if (!speechSynthesis) return;

		speechSynthesis.cancel();

		const getTestText = (lang: string): string => {
			const langBase = lang.split("-")[0];
			const testTexts: { [key: string]: string } = {
				en: "Hello, this is a voice preview. How do you like the sound of this voice?",
				es: "Hola, esta es una vista previa de voz. ¿Cómo te gusta el sonido de esta voz?",
				fr: "Bonjour, ceci est un aperçu vocal. Comment aimez-vous le son de cette voix?",
				de: "Hallo, das ist eine Stimmvorschau. Wie gefällt Ihnen der Klang dieser Stimme?",
				it: "Ciao, questa è un'anteprima vocale. Come ti piace il suono di questa voce?",
				pt: "Olá, esta é uma prévia de voz. Como você gosta do som desta voz?",
				ja: "こんにちは、これは音声プレビューです。この声の音はいかがですか？",
				ko: "안녕하세요, 이것은 음성 미리보기입니다. 이 목소리의 소리가 어떠신가요?",
				zh: "你好，这是语音预览。你觉得这个声音怎么样？",
				ar: "مرحبا، هذه معاينة صوتية. كيف يعجبك صوت هذا الصوت؟",
				hi: "नमस्ते, यह एक आवाज़ पूर्वावलोकन है। आपको इस आवाज़ की आवाज़ कैसी लगती है?",
				ru: "Привет, это предварительный просмотр голоса. Как вам нравится звук этого голоса?",
				nl: "Hallo, dit is een stemvoorbeeld. Hoe vind je het geluid van deze stem?",
				sv: "Hej, det här är en röstförhandsvisning. Hur tycker du om ljudet av denna röst?",
				th: "สวัสดี นี่คือการแสดงตัวอย่างเสียง คุณชอบเสียงนี้ไหม?",
				vi: "Xin chào, đây là bản xem trước giọng nói. Bạn thích âm thanh của giọng nói này như thế nào?"
			};

			return testTexts[langBase] || testTexts["en"];
		};

		const testText = getTestText(voice.lang);
		const utterance = new SpeechSynthesisUtterance(testText);
		utterance.voice = voice;
		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 1;

		speechSynthesis.speak(utterance);
	};

	return (
		<>
			{/* Main Interface */}
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-8 lg:mb-12 px-4 lg:px-8">
					<AudioVisualization isPlaying={isPlaying} />
					<AudioVisualization isPlaying={isPlaying} />
				</div>

				{/* Text Input Area with Integrated Controls */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-700 relative mx-2 lg:mx-0">
					<Textarea
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder="Type something here..."
						className="bg-transparent border-none text-white placeholder-gray-500 text-base lg:text-lg resize-none min-h-[100px] lg:min-h-[120px] focus:ring-0 focus:outline-none pr-4 focus-visible:ring-0 mb-4 w-full"
					/>

					{/* Bottom Controls Bar */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
						{/* Left: Navigation and Suggestions */}
						<div className="flex items-center gap-2 flex-1 min-w-0 order-2 sm:order-1">
							<Button
								size="sm"
								variant="ghost"
								className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
								onClick={prevSuggestions}
								disabled={currentSuggestionIndex === 0}
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>

							<div className="flex gap-1 sm:gap-2 overflow-hidden flex-1 min-w-0">
								{suggestions
									.slice(
										currentSuggestionIndex,
										currentSuggestionIndex + visibleSuggestions
									)
									.map((suggestion, index) => (
										<Badge
											key={currentSuggestionIndex + index}
											variant="secondary"
											className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-2 sm:px-3 py-1 cursor-pointer transition-colors border border-gray-600 text-xs whitespace-nowrap flex-shrink-0"
											onClick={() => handleSuggestionClick(suggestion)}
										>
											{suggestion.title}
										</Badge>
									))}
							</div>

							<Button
								size="sm"
								variant="ghost"
								className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
								onClick={nextSuggestions}
								disabled={currentSuggestionIndex >= maxIndex}
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>

						{/* Right: Voice Selector and Play Button */}
						<div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
							{/* Voice Selector */}
							<div className="flex items-center gap-2">
								<div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
								<Volume2 className="w-3 h-3 text-gray-400" />
								<Select value={selectedVoice} onValueChange={setSelectedVoice}>
									<SelectTrigger className="w-28 lg:w-32 h-8 bg-transparent border-none text-white text-xs focus:ring-0 focus:outline-none">
										<SelectValue placeholder="Voice">
											{selectedVoice && (
												<div className="flex items-center gap-1">
													<span className="text-sm">
														{getCountryFlag(
															voices.find(v => v.name === selectedVoice)
																?.lang || ""
														)}
													</span>
													<span className="font-medium text-xs truncate">
														{voices
															.find(v => v.name === selectedVoice)
															?.name.replace(/^Microsoft\s+/, "")
															.replace(/^Google\s+/, "")
															.split(" -")[0] || ""}
													</span>
												</div>
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent className="bg-gray-900 border-gray-600 backdrop-blur-sm w-80 lg:w-96 max-h-80 overflow-y-auto">
										{voices.map(voice => (
											<div key={voice.name} className="relative">
												<SelectItem
													value={voice.name}
													className="text-white hover:bg-gray-700 focus:bg-gray-700 p-3 pl-12 pr-12"
												>
													<div className="flex items-center gap-3 w-full">
														<span className="text-lg">
															{getCountryFlag(voice.lang)}
														</span>
														<div className="flex flex-col flex-1">
															<span className="font-medium">
																{voice.name
																	.replace(/^Microsoft\s+/, "")
																	.replace(/^Google\s+/, "")}
															</span>
															<span className="text-xs text-gray-400 line-clamp-2">
																{getVoiceDescription(voice)}
															</span>
														</div>
													</div>
												</SelectItem>
												<Button
													size="sm"
													variant="ghost"
													className="absolute left-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 rounded-full z-10"
													onClick={e => {
														e.preventDefault();
														e.stopPropagation();
														testVoice(voice);
													}}
												>
													<Play className="w-4 h-4" />
												</Button>
												{selectedVoice === voice.name && (
													<div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10">
														<span className="text-white text-xs">✓</span>
													</div>
												)}
											</div>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Play Button */}
							<Button
								onClick={handlePlay}
								disabled={!text.trim()}
								className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full p-0 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
							>
								{isPlaying ? (
									<Pause className="w-4 h-4" />
								) : (
									<Play className="w-4 h-4 ml-0.5" />
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Voice Count Info */}
				{voices.length > 0 && (
					<div className="text-center mt-6 lg:mt-8 px-4">
						<p className="text-sm text-gray-400">
							{voices.length} voices available •{" "}
							{new Set(voices.map(v => v.lang.split("-")[0])).size} languages
							supported
						</p>
					</div>
				)}

				{/* Status */}
				{isPlaying && (
					<div className="text-center mt-4 lg:mt-6 px-4">
						<p className="text-gray-400">Playing...</p>
					</div>
				)}
			</div>
		</>
	);
};
