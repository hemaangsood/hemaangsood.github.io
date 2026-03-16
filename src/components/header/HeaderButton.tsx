import React from "react";
	
interface HeaderButtonProps {
	children: React.ReactNode;
	onClick: () => void;
	style: React.CSSProperties;
	className?: string;
}

export function HeaderButton({
	children,
	onClick=() => {},
	style,
	className=""
}: HeaderButtonProps) {
	return (
		<div onClick={onClick} className={className + " cursor-pointer"} style={style}>
			{children}
		</div>
	);
}
