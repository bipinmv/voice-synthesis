interface AudioVisualizationProps {
	isPlaying: boolean;
}

const getGradientClass = (index: number): string => {
	const remainder = index % 4;
	if (remainder === 0) {
		return "from-blue-500 to-purple-500";
	}
	if (remainder === 1) {
		return "from-purple-500 to-pink-500";
	}
	if (remainder === 2) {
		return "from-pink-500 to-red-500";
	}
	return "from-red-500 to-orange-500";
};

const getBarClassName = (isPlaying: boolean, index: number): string => {
	const baseClass = "w-2 bg-gradient-to-t transition-all duration-300";
	if (!isPlaying) {
		return `${baseClass} from-gray-600 to-gray-400`;
	}
	const gradientClass = getGradientClass(index);
	return `${baseClass} animate-pulse ${gradientClass}`;
};

const AudioVisualization = ({ isPlaying }: AudioVisualizationProps) => {
	return (
		<div className="flex items-end gap-1 h-20">
			{Array.from({ length: 12 }).map((_, i) => (
				<div
					key={i}
					className={getBarClassName(isPlaying, i)}
					style={{
						height: isPlaying ? `${Math.random() * 60 + 20}px` : "20px",
						animationDelay: `${i * 0.1}s`
					}}
				/>
			))}
		</div>
	);
};

export default AudioVisualization;
