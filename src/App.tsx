import { Html, OrbitControls, Sky, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Toaster } from "react-hot-toast";
import { atom, Provider } from "jotai";
import { $ } from "src/atoms";
import { getEngineMove, makeMove } from "@/chess/state";
import { Text } from "@react-three/drei";
import { useAtomValue } from "jotai/utils";
import { Camera } from "./components/Camera";
import { Light } from "./Light";
import { Keyboard, useKeyboardInput } from "./Keyboard";
import TerrainDemo from "@/terrain/Demo";
import React from "react";

// function UI() {
//   const inCheckmate = useAtomValue($.inCheckmate);
//   return (
//     <>
//       <Text
//         position={[-30, 0, 0]}
//         rotation={[-Math.PI / 2, 0, 0]}
//         color="white"
//         fontSize={4}
//         anchorX="center"
//         anchorY="middle"
//       >
//         {inCheckmate ? "checkmate " : "hello world!"}
//       </Text>
//       <Html position={[-30, 0, 0]}>
//         <div>Turn: {useAtomValue($.turn)} </div>
//       </Html>
//     </>
//   );
// }

export function App() {
  return (
    <Provider>
      <div className="h-screen w-screen">
        <Toaster />
        <Canvas shadows>
          <color attach="background" args={["black"]} />
          <TerrainDemo />
          <Keyboard />
          <Light />
          <Stats />
        </Canvas>
        <Debugger />
      </div>
    </Provider>
  );
}

function Debugger() {
  return (
    <pre className="fixed bottom-2 right-2">
      {JSON.stringify(useKeyboardInput((s) => s.controls))}
    </pre>
  );
}
