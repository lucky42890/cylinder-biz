import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DEFAULT_CYLINDER_NUM = 20;
const DEFAULT_ROUND_COLOR_NUM = 20;

const Cylinder = () => {

  const glContainer = useRef(null);

  const [roundColorNum, setRoundColorNum] = useState(DEFAULT_ROUND_COLOR_NUM);
  const [numberOfCylinders, setNumberOfCylinders] = useState(DEFAULT_CYLINDER_NUM);

  let scene;
  let camera;
  let renderer;
  let controls;

  useEffect(() => {

    if (glContainer) {
      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x000000 );
      scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      glContainer.current.innerHTML = "";
      glContainer.current.appendChild( renderer.domElement );

      camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.set( 400, 200, 100 );

      // controls
      controls = new OrbitControls( camera, renderer.domElement );

      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      controls.screenSpacePanning = false;

      controls.minDistance = 100;
      controls.maxDistance = 500;

      controls.maxPolarAngle = Math.PI / 2;

      // Calc ideal length of square contains all cylinders
      const idealLength = Math.ceil(Math.sqrt(numberOfCylinders));
      let zFloor = 0;

      for (let i = 0; i < numberOfCylinders; i++) {
        if (i % idealLength === 0 && i !== 0) {
          zFloor++;
        }

        const height = Math.random() * 200 - 100;
        const geometry = new THREE.CylinderBufferGeometry( 10, 10, Math.abs(height), 32, 1, false );
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = (i % idealLength) * 30 + Math.random() * 15;
        mesh.position.y = height / 2;
        mesh.position.z = zFloor * 30;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );
      }

      // Plane
      // const geometry = new THREE.PlaneGeometry( 500, 500, 32 );
      // const material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
      // const plane = new THREE.Mesh( geometry, material );
      // plane.rotateX(Math.PI / 2);
      // scene.add( plane );

      // lights
      const dirLight1 = new THREE.DirectionalLight( 0xffffff );
      dirLight1.position.set( 1, 1, 1 );
      scene.add( dirLight1 );

      const dirLight2 = new THREE.DirectionalLight( 0x002288 );
      dirLight2.position.set( - 1, - 1, - 1 );
      scene.add( dirLight2 );

      const ambientLight = new THREE.AmbientLight( 0x222222 );
      scene.add( ambientLight );
      
      const animate = () => {
				requestAnimationFrame( animate );
				controls.update();
				render();
      }
      
      const render = () => {
        renderer.render( scene, camera );
      }

      animate();
    }

  }, [glContainer, numberOfCylinders, roundColorNum])

  const handleRoundColorChange = (e) => {
    setRoundColorNum(e.target.value);
  }

  const handleCylinderNumChange = (e) => {
    setNumberOfCylinders(e.target.value);
  }

  return (
    <div className="cylinder">
      {/* Container of webgl */}
      <div ref={glContainer} >
      </div>

      <div className="cylinder-setting">
        {/* Input color of circle round */}
        <p>Color of Round</p>
        <input  
          type="number"
          min="-100"
          max="100"
          value={roundColorNum}
          onChange={handleRoundColorChange}
        />
        <hr />

        {/* Input number of cylinders */}
        <p>Number of Cylinders</p>
        <input
          type="number"
          min="-100"
          max="100"
          value={numberOfCylinders}
          onChange={handleCylinderNumChange}
        />
      </div>
    </div>
  )
}

export default Cylinder;