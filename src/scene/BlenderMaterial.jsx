// src/components/BlenderModel.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const BlenderModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.toneMapping = THREE.ACESFilmicToneMapping; 
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding; 
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Load HDRI Background using RGBELoader
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://blender-pub.s3.us-west-2.amazonaws.com/bg.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping; 
      scene.background = texture; 
      scene.environment = texture; 
    });

    // Load the Blender model (GLB/GLTF)
    const loader = new GLTFLoader();
    loader.load("https://blender-pub.s3.us-west-2.amazonaws.com/scene.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Optionally scale or position the model
      model.scale.set(1, 1, 1); 
      model.position.set(0, 0, 0);
    });

    // Add OrbitControls for 360-degree rotation, zoom, and panning
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; 
    controls.minDistance = 2; 
    controls.maxDistance = 50; 
    controls.enablePan = true; 

    // Set camera position - Move slightly outward
    camera.position.set(25, 20, 0);
    camera.lookAt(10, 0, 30); 

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize the canvas when the window is resized
    const handleWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleWindowResize);

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default BlenderModel;