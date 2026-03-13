import type { ContainerPropsElement } from "./types";

interface HeaderContainerProps {
	items?: ContainerPropsElement[];
	side: "left" | "right";
	style?: React.CSSProperties;
}

export const HeaderContainerItem = ({
	title,
	onClick,
	style,
}: ContainerPropsElement) => {
	return (
		<div
			onClick={onClick}
			style={{
				cursor: onClick ? "pointer" : "default",
				...style,
			}}
		>
			{title}
		</div>
	);
};

const HeaderContainer = ({ items, side, style }: HeaderContainerProps) => {
	const isLeftContainer = side === "left";
	const containerStyle: React.CSSProperties = {
		marginLeft: isLeftContainer ? "1rem" : "auto",
		marginRight: !isLeftContainer ? "1rem" : "auto",
		display: "flex",
		gap: "1rem",
		...style,
	};
	return (
		<>
			<div className="m-auto" style={containerStyle}>
				{items?.map((item, index) => (
					<HeaderContainerItem key={index} {...item} />
				))}
			</div>
		</>
	);
};

export default HeaderContainer;
