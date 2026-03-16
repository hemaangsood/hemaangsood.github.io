import { useEffect, useRef } from "react";
import * as THREE from "three";

class GraphNode {
	id: number;
	position: THREE.Vector3;
	children: GraphNode[];
	color: THREE.Color;

	constructor(id: number, position: THREE.Vector3,array:GraphNode[],maxNodes:number=100) {
		this.id = id;
		this.position = position;
		this.children = [];
		this.color = new THREE.Color().setHSL(
			Math.random(),
			0.7,
			0.6,
		);
		if (array.length >= maxNodes) return;
		for(let i=0;i<Math.floor(Math.random()*3)+1;i++) {
			this.children.push(new GraphNode(id*10+i+1, new THREE.Vector3(
				position.x + (Math.random() - 0.5) * 2,
				position.y + (Math.random() - 0.5) * 2,
				position.z + (Math.random() - 0.5) * 2,
			), array, maxNodes));
		}
		array.push(this);
	}
}

export default function RandGraph({seed="n3og3",speed="10",parentRef,radius=0.1}:{
	seed?:string,
	speed?:string,
	parentRef:React.RefObject<HTMLDivElement>,
	radius?:number
}):React.ReactNode {
	const mountRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if(!parentRef.current) {
			console.warn("Parent reference is not available for RandGraph");
			return;
		}
		// eslint-disable-next-line no-var
		var array:GraphNode[] = [];
		const localMountRef = mountRef.current;
				const localParentRef = parentRef.current;
				if (!localMountRef) {
					return;
				}
		
				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(
					75,
					(localParentRef?.offsetWidth || window.innerWidth) /
						(localParentRef?.offsetHeight || window.innerHeight),
					0.1,
					1000,
				);
				camera.position.z = 4;
		
				const renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
				});
				renderer.setClearColor(0x000000, 0);
				renderer.setSize(
					localParentRef?.offsetWidth || window.innerWidth,
					localParentRef?.offsetHeight || window.innerHeight,
				);
				localMountRef.appendChild(renderer.domElement);

				const no_of_node = 100;
				const root = new GraphNode(1, new THREE.Vector3(0, 0, 0), array, no_of_node);
				const NodeGeometry = new THREE.SphereGeometry(radius, 8, 8);
				array.forEach(node => {
					const material = new THREE.MeshBasicMaterial({ color: node.color });
					const sphere = new THREE.Mesh(NodeGeometry, material);
					sphere.position.copy(node.position);
					scene.add(sphere);
				});

				const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
				array.forEach(node => {
					node.children.forEach(child => {	
						const points = [node.position, child.position];
						const geometry = new THREE.BufferGeometry().setFromPoints(points);
						const line = new THREE.Line(geometry, lineMaterial);
						scene.add(line);
					});
				});

				const animate = function () {
					requestAnimationFrame(animate);
					scene.rotation.y += parseFloat(speed) * 0.001;
					renderer.render(scene, camera);
				};
				animate();
		return () => {
			
		};
	}, []);
	return <div ref={mountRef}></div>
}