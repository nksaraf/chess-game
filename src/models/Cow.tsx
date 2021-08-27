/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { Html, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { AnimationClip } from "three";
import { useControls } from "leva";
import { atomFamily, useAtomValue } from "jotai/utils";
import { atom } from "jotai";
import { $, useCharacter } from "../atoms";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.SkinnedMesh;
    Cube_1: THREE.SkinnedMesh;
    Cube_2: THREE.SkinnedMesh;
    Cube_3: THREE.SkinnedMesh;
    Cube_4: THREE.SkinnedMesh;
    Cube_5: THREE.SkinnedMesh;
    Cube_6: THREE.SkinnedMesh;
    Body: THREE.Bone;
    IKBackLegL: THREE.Bone;
    IKFrontLegL: THREE.Bone;
    IKBackLegR: THREE.Bone;
    IKFrontLegR: THREE.Bone;
  };
  materials: {
    Main: THREE.MeshStandardMaterial;
    Main_Light: THREE.MeshStandardMaterial;
    Hooves: THREE.MeshStandardMaterial;
    Muzzle: THREE.MeshStandardMaterial;
    Eye_Black: THREE.MeshStandardMaterial;
    Eye_White: THREE.MeshStandardMaterial;
    Horns: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Attack_Headbutt"
  | "Attack_Kick"
  | "Death"
  | "Eating"
  | "Gallop"
  | "Gallop_Jump"
  | "Idle"
  | "Idle_2"
  | "Idle_Headlow"
  | "Idle_HitReact_Left"
  | "Idle_HitReact_Right"
  | "Jump_toIdle"
  | "Walk";

interface GLTFActions extends AnimationClip {
  name: ActionName;
}

import { Loader } from "three";
// @ts-ignore
import { GLTFLoader, DRACOLoader, MeshoptDecoder } from "three-stdlib";
import { useFrame, useGraph, useLoader } from "@react-three/fiber";
import { useKeyboardInput } from "src/Keyboard";

function onEnter<T extends string>(
  state: T,
  prevState: T,
  onEnter: { [k in T]?: (prevState: T) => void }
) {
  onEnter[state]?.(prevState);
}

function onExit<T extends string>(
  state: T,
  prevState: T,
  onExit: { [k in T]?: (prevState: T) => void }
) {
  onExit[state]?.(prevState);
}

export function Character() {
  const state = useCharacter((s) => s.state);
  const object = useAtomValue($.gltfAsset("/animals/Cow.gltf"));
  const { actions, ref } = useAnimations<GLTFActions>(object.animations as any);

  const controls = useControls("character", {
    moveSpeed: 0.02,
    position: [-15, 0, 6],
    animation: {
      value: "Attack_Headbutt" as keyof typeof actions,
      options: Object.keys(actions) as ActionName[],
    },
  });

  function getAction(
    state: ReturnType<typeof useCharacter["getState"]>["state"]
  ) {
    return actions[
      (
        {
          idle: "Idle",
          walk: "Walk",
          run: "Gallop",
          attack: "Attack_Headbutt",
        } as const
      )[state]
    ];
  }

  useFrame(() => {
    const { state } = useCharacter.getState();
    const { controls } = useKeyboardInput.getState();

    var nextState = state;

    switch (state) {
      case "idle": {
        if (controls.forward || controls.backward) {
          nextState = "walk";
        }
        break;
      }
      case "walk": {
        if (controls.shift) {
          nextState = "run";
        } else if (!controls.forward && !controls.backward) {
          nextState = "idle";
        }
        break;
      }
      case "run": {
        if (!controls.shift) {
          nextState = "walk";
        }
        break;
      }
    }

    if (nextState != state) {
      onExit(state, nextState, {});
      onEnter(nextState, state, {
        idle: (prevState) => {
          let idleAction = actions["Idle"]!;
          if (prevState) {
            idleAction.time = 0;
            idleAction.enabled = true;
            idleAction.setEffectiveWeight(1.0);
            idleAction.setEffectiveTimeScale(1.0);
            idleAction?.crossFadeFrom(getAction(prevState)!, 0.5, true);
            idleAction.play();
          } else {
            idleAction.play();
          }
        },
        walk: (prevState) => {
          let walkAction = actions["Walk"]!;
          walkAction.enabled = true;
          if (prevState === "run") {
            let runAction = getAction("run")!;
            walkAction.time =
              runAction.time *
              (walkAction.getClip().duration / runAction.getClip().duration);
          } else {
            walkAction.time = 0.0;
            walkAction.setEffectiveWeight(1.0);
            walkAction.setEffectiveTimeScale(1.0);
          }
          walkAction?.crossFadeFrom(getAction(prevState)!, 0.5, true);
          walkAction.play();
        },
        run: (prevState) => {
          let runAction = getAction("run")!;
          runAction.enabled = true;
          if (prevState === "walk") {
            let walkAction = getAction("walk")!;
            runAction.time =
              walkAction.time *
              (runAction.getClip().duration / walkAction.getClip().duration);
          } else {
            runAction.time = 0.0;
            runAction.setEffectiveWeight(1.0);
            runAction.setEffectiveTimeScale(1.0);
          }
          runAction?.crossFadeFrom(getAction(prevState)!, 0.5, true);
          runAction.play();
        },
      });

      console.log("transition", state, nextState);
      useCharacter.setState({ state: nextState });
    }
  });

  return (
    <>
      <CowModel
        ref={ref}
        gltf={object}
        position={controls.position}
        rotation={[0, Math.PI, 0]}
        onPointerDown={() => {
          // dispatch({ type: "MOVE" });
        }}
      />
      <Html position={[-15, 2, 6]}>
        <h1>{state}</h1>
      </Html>
    </>
  );
}

const CowModel = React.forwardRef(function CowModel(
  props: JSX.IntrinsicElements["group"] & { gltf: GLTF },
  ref: React.Ref<THREE.Object3D | null | undefined>
) {
  const { nodes, materials } = useGraph(props.gltf.scene) as GLTFResult;

  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="AnimalArmature" userData={{ name: "AnimalArmature" }}>
          <primitive object={nodes.Body} />
          <primitive object={nodes.IKBackLegL} />
          <primitive object={nodes.IKFrontLegL} />
          <primitive object={nodes.IKBackLegR} />
          <primitive object={nodes.IKFrontLegR} />
          <group name="Cow" userData={{ name: "Cow" }}>
            <skinnedMesh
              name="Cube"
              geometry={nodes.Cube.geometry}
              material={materials.Main}
              skeleton={nodes.Cube.skeleton}
            />
            <skinnedMesh
              name="Cube_1"
              geometry={nodes.Cube_1.geometry}
              material={materials.Main_Light}
              skeleton={nodes.Cube_1.skeleton}
            />
            <skinnedMesh
              name="Cube_2"
              geometry={nodes.Cube_2.geometry}
              material={materials.Hooves}
              skeleton={nodes.Cube_2.skeleton}
            />
            <skinnedMesh
              name="Cube_3"
              geometry={nodes.Cube_3.geometry}
              material={materials.Muzzle}
              skeleton={nodes.Cube_3.skeleton}
            />
            <skinnedMesh
              name="Cube_4"
              geometry={nodes.Cube_4.geometry}
              material={materials.Eye_Black}
              skeleton={nodes.Cube_4.skeleton}
            />
            <skinnedMesh
              name="Cube_5"
              geometry={nodes.Cube_5.geometry}
              material={materials.Eye_White}
              skeleton={nodes.Cube_5.skeleton}
            />
            <skinnedMesh
              name="Cube_6"
              geometry={nodes.Cube_6.geometry}
              material={materials.Horns}
              skeleton={nodes.Cube_6.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
});
