import type React from "react"

export interface LogoProps {
	style?:React.CSSProperties,
	onClick?:() => void
}

export default function Logo({ style, onClick }: LogoProps) {
	return (<div className="my-auto mr-5">
		<p
			style={style}
			onClick={onClick}
			className="text-5xl"
		>Hemaang Sood</p>
	</div>)
}