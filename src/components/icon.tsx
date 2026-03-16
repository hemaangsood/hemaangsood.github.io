export default function Icon({ style,className="", imagePath,size=1 }: { style?: React.CSSProperties; className?: string; imagePath: string; size?: number }) {
	return (
		<img
			src={imagePath}
			alt="Icon"
			className={`${className}`}
			style={{ 
				height: `auto`,
				width: `${size}px`,
				objectFit: "contain",
				filter:"grayscale(100%) brightness(150%)",
				...style }}
		/>
	);
}