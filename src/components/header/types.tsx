export type ContainerSide = "left" | "right";

export type ContainerPropsElement = {
	side?: ContainerSide;
	title: string;
	onClick?: () => void;
	style?: React.CSSProperties;
};
