/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: e Rac (https://sketchfab.com/e_rac)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/low-poly-chess-set-0e8aa570aa5448eca820d8ae760d663b
title: Low Poly Chess Set
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_1: THREE.Mesh;
    mesh_2: THREE.Mesh;
    mesh_3: THREE.Mesh;
    mesh_4: THREE.Mesh;
    mesh_5: THREE.Mesh;
  };
  materials: {
    New_material_001: THREE.MeshStandardMaterial;
    New_material_002: THREE.MeshStandardMaterial;
    boardB: THREE.MeshStandardMaterial;
    boardW: THREE.MeshStandardMaterial;
  };
};

export default React.forwardRef(function ChessSet(
  props: JSX.IntrinsicElements["group"],
  ref: any
) {
  // const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(
    "/low_poly_chess_set/scene.gltf"
  ) as GLTFResult;
  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="OSG_Scene">
        <group
          name="RootNode_(gltf_orientation_matrix)"
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ name: "RootNode (gltf orientation matrix)" }}
        >
          <group
            name="RootNode_(model_correction_matrix)"
            userData={{ name: "RootNode (model correction matrix)" }}
          >
            <group name="2objcleaner" userData={{ name: "2.obj.cleaner" }}>
              <mesh
                name="mesh_0"
                material={materials.New_material_001}
                geometry={nodes.mesh_0.geometry}
              />
              <mesh
                name="mesh_1"
                material={materials.New_material_001}
                geometry={nodes.mesh_1.geometry}
              />
              <mesh
                name="mesh_2"
                material={materials.New_material_002}
                geometry={nodes.mesh_2.geometry}
              />
              <mesh
                name="mesh_3"
                material={materials.New_material_002}
                geometry={nodes.mesh_3.geometry}
              />
              <mesh
                name="mesh_4"
                material={materials.boardB}
                geometry={nodes.mesh_4.geometry}
              />
              <mesh
                name="mesh_5"
                material={materials.boardW}
                geometry={nodes.mesh_5.geometry}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload("/low_poly_chess_set/scene.gltf");
