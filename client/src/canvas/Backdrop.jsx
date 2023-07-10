/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import state from "../store";
import { useSnapshot } from "valtio";

const Backdrop = () => {
  const shadows = useRef();
  const snap = useSnapshot(state);
  return (
    <AccumulativeShadows
      position={[0, 0, -0.14]}
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.75}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      color={snap.color}
    >
      <RandomizedLight
        amount={3}
        radius={9}
        intensity={0.65}
        ambient={0.55}
        position={[5, 5, -10]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
