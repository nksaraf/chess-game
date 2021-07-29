/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useControls } from "leva";
import React from "react";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { Color, Square } from "@/chess/types";
import { useAtom } from "jotai";
import { $ } from "src/atoms";
import { useHover } from "./useHover";
import { BLACK } from "@/chess";

type GLTFResult = GLTF & {
  nodes: {
    Rook: THREE.Mesh;
    Queen: THREE.Mesh;
    Bishop: THREE.Mesh;
    King: THREE.Mesh;
    Knight: THREE.Mesh;
    Pawn: THREE.Mesh;
  };
  materials: {
    white_piece: THREE.MeshStandardMaterial;
    black_piece: THREE.MeshStandardMaterial;
  };
};

export function Piece({
  piece = "Queen" as PieceType,
  color = BLACK as Color,
  square = "a1" as Square,
  position = [0, 0, 0] as [number, number, number],
  ...props
}) {
  const colors = useControls("colors", {
    black_piece: "#414141",
    white_piece: "#FFFFFF",
  });
  const [x, y, z] = position;

  const [isSquareHovered, setIsSquareHovered] = useAtom(
    $.isHoveredSquare(square)
  );

  const [selectedSquare, setSelectedSquare] = useAtom($.selectedSquare);

  const isSelected = selectedSquare === square;
  const [_, bind] = useHover({
    onPointerEnter: (e) => {
      setIsSquareHovered(true);
    },
    onPointerLeave: (e) => {
      setIsSquareHovered(false);
    },
  });

  const { spring: hoverSpring } = useSpring({
    spring: isSquareHovered || isSelected ? 1 : 0,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  });

  const positionY = hoverSpring.to([0, 1], [y, y + 0.3]);
  const rotationY = hoverSpring.to([0, 1], [0, 0.5]);

  return (
    <a.group
      position-x={x}
      position-y={positionY}
      position-z={z}
      rotation-y={rotationY}
    >
      <PieceModel
        {...bind}
        piece={piece}
        onPointerDown={() => {
          setSelectedSquare(square);
        }}
        rotation={[-Math.PI / 2, 0, color === BLACK ? Math.PI : 0]}
        {...props}
      >
        <meshStandardMaterial
          color={
            isSquareHovered
              ? "red"
              : isSelected
              ? "gold"
              : color === BLACK
              ? colors["black_piece"]
              : colors["white_piece"]
          }
        />
      </PieceModel>
    </a.group>
  );
}

type PieceType = keyof GLTFResult["nodes"];

export function PieceModel({
  piece = "Queen",
  material = "black_piece" as keyof GLTFResult["materials"],
  children,
  ...props
}: JSX.IntrinsicElements["group"] & {
  piece: PieceType;
  material?: keyof GLTFResult["materials"];
}) {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(
    "/low_poly_chess_set/pieces.glb"
  ) as GLTFResult;
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name={piece}
          castShadow
          receiveShadow
          geometry={nodes[piece].geometry}
          {...(material ? { material: materials[material] } : {})}
          userData={{ name: piece }}
        >
          {children}
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/low_poly_chess_set/pieces.glb");
