import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SystemSceneProps = {
  className?: string;
};

export default function SystemScene({ className = "" }: SystemSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const lowPower = window.matchMedia("(max-width: 640px), (prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | undefined;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.25, 7);
      const root = new THREE.Group();
      scene.add(root);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.25, 2),
        new THREE.MeshBasicMaterial({ color: 0x3d8fe8, wireframe: true, transparent: true, opacity: 0.88 }),
      );
      root.add(core);
      const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.52, 1),
        new THREE.MeshBasicMaterial({ color: 0x8fc2ff, wireframe: true, transparent: true, opacity: 0.78 }),
      );
      root.add(inner);

      const nodePositions = [
        [-2.1, 1.15, 0.25], [2.1, .95, -.2], [-2.35, -.9, -.35], [2.25, -1.05, .15],
        [-.15, 2.25, -.4], [.45, -2.15, .25], [-1.78, .15, -.85], [1.75, .1, .75],
      ] as const;
      const nodeGeometry = new THREE.SphereGeometry(0.105, 14, 14);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x3d8fe8 });
      const warningMaterial = new THREE.MeshBasicMaterial({ color: 0x8fc2ff });
      const nodes = nodePositions.map((position, index) => {
        const node = new THREE.Mesh(nodeGeometry, index === 1 || index === 5 ? warningMaterial : nodeMaterial);
        node.position.set(position[0], position[1], position[2]);
        root.add(node);
        return node;
      });
      const segments = [[0, 4], [4, 1], [0, 6], [6, 2], [2, 5], [5, 3], [3, 7], [7, 1], [6, 0], [7, 3], [4, 0], [1, 7]];
      const linePositions: number[] = [];
      segments.forEach(([from, to]) => linePositions.push(...nodePositions[from], ...nodePositions[to]));
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x8ca8c6, transparent: true, opacity: 0.5 }));
      root.add(lines);

      const particles = new Float32Array((lowPower ? 90 : 170) * 3);
      for (let index = 0; index < particles.length; index += 3) {
        const radius = 2.4 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const height = (Math.random() - .5) * 4.3;
        particles[index] = Math.cos(theta) * radius;
        particles[index + 1] = height;
        particles[index + 2] = Math.sin(theta) * radius;
      }
      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
      const particleCloud = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0x6caaf0, size: lowPower ? .028 : .035, transparent: true, opacity: .64, sizeAttenuation: true }));
      root.add(particleCloud);

      const pointer = new THREE.Vector2();
      const onPointerMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - .5) * .9;
        pointer.y = ((event.clientY - rect.top) / rect.height - .5) * .55;
      };
      host.addEventListener("pointermove", onPointerMove);
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height || !renderer) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
      setReady(true);

      const tick = (time: number) => {
        if (disposed || !renderer) return;
        const seconds = time * .001;
        if (!lowPower) {
          root.rotation.y += (pointer.x - root.rotation.y) * .025;
          root.rotation.x += ((-pointer.y) - root.rotation.x) * .025;
          root.rotation.z = Math.sin(seconds * .3) * .05;
          core.rotation.x = seconds * .16;
          core.rotation.y = seconds * .23;
          inner.rotation.y = -seconds * .38;
          particleCloud.rotation.y = -seconds * .025;
          nodes.forEach((node, index) => { node.scale.setScalar(1 + Math.sin(seconds * 2 + index) * .12); });
        }
        renderer.render(scene, camera);
        if (!lowPower) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      if (lowPower) requestAnimationFrame(tick);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        host.removeEventListener("pointermove", onPointerMove);
        core.geometry.dispose(); (core.material as THREE.Material).dispose();
        inner.geometry.dispose(); (inner.material as THREE.Material).dispose();
        nodeGeometry.dispose(); nodeMaterial.dispose(); warningMaterial.dispose();
        lineGeometry.dispose(); (lines.material as THREE.Material).dispose();
        particlesGeometry.dispose(); (particleCloud.material as THREE.Material).dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch (error) {
      console.warn("[SystemScene] WebGL scene unavailable", error);
      return undefined;
    }
  }, []);

  return <div ref={hostRef} className={`system-scene ${ready ? "is-ready" : ""} ${className}`} aria-hidden="true"><div className="system-scene__fallback"><span>∿</span><i /><b /></div></div>;
}
