import type React from "react"

export interface LogoProps {
	style?:React.CSSProperties,
	onClick?:() => void
}

export default function Logo({ style, onClick }: LogoProps) {
	return (<div className="my-auto mr-5 font-normal flex align-middle">
		<img src="/icons.png" alt="logo" className="w-8 h-8 mx-4 scale-150"
			style={{
				"filter": "brightness(50%) saturate(100%) invert(100%) sepia(4%) saturate(7470%) hue-rotate(16deg) brightness(124%) contrast(116%)"
			}}
		/>
		<p
			style={style}
			onClick={onClick}
			className="text-xl ml-2"
		>Hemaang Sood</p>
	</div>)
}