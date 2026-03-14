interface ContainerPropsElement {
	side?: "left" | "right";
	children: React.ReactNode;
	onClick?: () => void;
	style?: React.CSSProperties;
};

interface HeaderContainerProps {
	items?: ContainerPropsElement[];
	side: "left" | "right";
	style?: React.CSSProperties;
}

export const HeaderContainerItem = ({
	children,
	onClick,
	style,
}: ContainerPropsElement) => {
	return (
		<div
			className="mt-1 pb-1"
			onClick={onClick}
			style={{
				cursor: onClick ? "pointer" : "default",
				...style,
			}}
		>
			{children}
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
			<div className="m-auto rounded-xl px-2" style={containerStyle}>
				{items?.map((item, index) => (
					<HeaderContainerItem key={index} {...item} />
				))}
			</div>
		</>
	);
};

export default HeaderContainer;
