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
    rgbeLoader.load('/public/bg.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping; 
      scene.background = texture; 
      scene.environment = texture; 
    });

    // Load the Blender model (GLB/GLTF)
    const loader = new GLTFLoader();
    loader.load("https://blender-pub.s3.us-west-2.amazonaws.com/scene.glb?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGcaCXVzLXdlc3QtMiJHMEUCIQCT2wO6SVZpqghYUGpjz5JpFu%2FFwsEfvq%2FBfBh9tGCqhwIgC3OZi81ZyF%2Flz%2FljZ8pFNhgwzK6%2FnQo773NK7PtPqtcqjgMIwP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw4OTUyOTQ5NzQ3NDUiDASKjgelMlOrSv64HSriAjYJjeFervkneHeb2m47vu9WtUe55ufOrCI0Va%2BrHAb5jKSP%2FqvZ%2FF%2F8Y9kJtbOSLwZHX1z%2F2qcN4mVm4ejOi4T3VUxVRNIgg80eo7O7yn6IorFefpU2rwuKO5MJZhJ0trdmWeanD5RI3OGLSY8YDHWepMJnOntbTAA84n%2F4p4jrQ7Hy5pCTdThauvq4ZAGTkqqf9tbiATsQJ3lz9h9ZVGZOg6FkEjyCekaF1Jzt4K2aKzyKQHC6E3DqtxpX4UvhyMSqWmfvM9psnBqpXRbIF45774EytioNin%2FEWgKPD6TcPdqh1vd5VwO2P5HyOx7iIv87BNdcZh3qMZpBSYrvfa%2FUyYil%2BZ7daqUkgQHACdxmSorI%2FCBuDiFaef5%2FjNE8kUaWI8FHhIlgOQBwAsdkcPh4CsiDGG2Rq2ggHEJ7TllqSp8VpXvjI7PP4yvidQJdkI%2BAf12%2BWDhZsOgKY2jCBROS1jD7uq%2B4BjqzAtlMLeeJ0mlyTLUXZh7umvQ1UW7Mp9%2BSab5H0P8yg2WvjAVo4fQpmTl53StbcPodT54dvrJ80SHFVQhtk%2BtEqBcEBOAgzJ4RYBpJGPb0tLu%2FOrzUA%2BBJ%2FwkU4b0EYi4k9Op4wzD3yRVATPtssRY93zksaOLobet5aE%2FcSA1DUJMdQcmWafl21ZA6NSvut8oF5%2Bq%2BgpeLPQnl%2F4jnCuKI%2B147I8aBuQjEpDB98Ge084%2BFZ2BbT2Ut8sWhNKELfw9RXpP2WjN9ISix0jUJshz9%2Bo%2F5ID2BqOhqVvFNLsxBNcOVOEKHU76vjpHvsZHOtRbiZBr9RV8wbnQf%2B9FJ%2FSI7u0i4oeVq8NSx0x8puftGdxJ1sXgbzr5pYGbFv2rALL%2B36T2VRdTDaWYrlmN6VzcDXMeyC8Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241013T145148Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA5A455FMM5C2IA72T%2F20241013%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=3d02eb6aed3d26b61be2c8a879808c4d655f0d55247c4c10e3bc5559f5d4220f", (gltf) => {
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