import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useRef, useState } from "react";
import ImageObject from "./ImageObject";
import Loader from "./Loader";

export default function Scene({ layers }) {
    const cameraCenter = [0, 1.5, 0];
    const ref = useRef();
    const [isDragging, setIsDragging] = useState(false);

    const takeSnapshot = useCallback(() => {
        const canvas = ref.current.querySelector("canvas");
        console.log(canvas);
        if (canvas) {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = "scene-snapshot.png";
            link.href = image;
            link.click();
        }
    }, [ref]);

    return (
        <div
            ref={ref}
            // className="p-8"
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
            }}
        >
            <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                <OrthographicCamera
                    makeDefault
                    position={[0, 3, 5]}
                    zoom={200}
                    onUpdate={(self) => self.lookAt(...cameraCenter)}
                />
                <color attach="background" args={["#000000"]} />
                <Suspense fallback={<Loader />}></Suspense>
                {!isDragging && <OrbitControls target={cameraCenter} />}
                {layers.map(
                    (layer, index) =>
                        layer.visible && (
                            <ImageObject
                                key={layer.name}
                                url={layer.url}
                                position={layer.position}
                                scale={layer.scale}
                                setIsDragging={setIsDragging}
                                renderOrder={index}
                            />
                        )
                )}
            </Canvas>
            <div className="absolute bottom-0 flex flex-row gap-4">
                <button
                    className="ml-4 my-4 py-2 px-4 border border-white box-border text-white"
                    onClick={takeSnapshot}
                >
                    {"export"}
                </button>
            </div>
        </div>
    );
}
