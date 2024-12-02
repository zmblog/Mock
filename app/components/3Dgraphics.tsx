"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const ThreeDGraphics = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      1, // Aspect ratio to make the graphic fit its container
      0.1,
      2000
    );
    camera.position.set(0, 0, 300); // Adjust camera position for smaller size

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(100, 100); // Small size for the top-left corner
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 2000);
    pointLight.position.set(0, 300, 800);
    scene.add(pointLight);

    // Load HDRI environment map
    const hdrLoader = new RGBELoader();
    hdrLoader.load(
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/neon_photostudio_2k.hdr",
      (hdrMap) => {
        hdrMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrMap;
      }
    );

    // Create polished silver material
    const createPolishedMaterial = () => {
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.1,
        envMapIntensity: 1,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
      });
    };

    // Create a polished central sphere
    const sphereGeometry = new THREE.SphereGeometry(75, 96, 96); // Reduced size
    const sphereMaterial = createPolishedMaterial();
    const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(centralSphere);

    // Create spikes dynamically
    const spikeCount = 0;
    const maxSpikes = 50; // Fewer spikes for smaller size
    const interval = setInterval(() => {
      if (spikeCount < maxSpikes) {
        const cylinderGeometry = new THREE.CylinderGeometry(7, 7, 150, 48); // Smaller spikes
        const spikeMaterial = createPolishedMaterial();
        const spike = new THREE.Mesh(cylinderGeometry, spikeMaterial);
        const randomDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          randomDirection
        );
        spike.applyQuaternion(quaternion);
        spike.position.copy(randomDirection.multiplyScalar(50));
        centralSphere.add(spike);
      } else {
        clearInterval(interval);
      }
    }, 100);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      centralSphere.rotation.x += 0.005;
      centralSphere.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      renderer.dispose();
      scene.clear();
      clearInterval(interval);
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0"></div>;
};

export default ThreeDGraphics;
