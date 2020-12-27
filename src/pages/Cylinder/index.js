import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as ThreeCSG from "three-js-csg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DEFAULT_CYLINDER_NUM = 20;
const DEFAULT_ROUND_COLOR_NUM = 20;
const ThreeBSP = ThreeCSG(THREE);

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
      createChart();
    }

  }, [glContainer])

  const createChart = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    glContainer.current.innerHTML = "";
    glContainer.current.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 0, 0 );

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
      const material = new THREE.MeshPhongMaterial( { color: getRandomColor(), flatShading: true } );
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = (i % idealLength) * 30 + Math.random() * 15;
      mesh.position.y = height / 2;
      mesh.position.z = zFloor * 30;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scene.add( mesh );
    }

    // Circle round
    const radius = idealLength * 15 * Math.sqrt(2);
    const box = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 20, 32, 1));
    const sphere = new THREE.Mesh(new THREE.CylinderGeometry(radius - 2, radius - 2, 20, 32, 1));

    const sBSP = new ThreeBSP(sphere);
    const bBSP = new ThreeBSP(box);

    const sub = bBSP.subtract(sBSP);
    const roundMesh = sub.toMesh();
    roundMesh.position.x = idealLength * 15;
    roundMesh.position.z = idealLength * 15;
    roundMesh.material = new THREE.MeshPhongMaterial({ color: getRoundColor(), flatShading: true });
    scene.add(roundMesh);

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

  const getRandomColor = () => {
    let letters = '0123456789abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const getRoundColor = () => {
    let color = '#';
    const value = roundColorNum + 100;
    const redVal = parseInt(255 - (255 / 200) * value);
    const greenVal = parseInt((255 / 200) * value);
    console.log(value);
    console.log(redVal);
    console.log(greenVal);
    return color + redVal.toString(16) + greenVal.toString(16) + '00';
  }

  const handleRoundColorChange = (e) => {
    setRoundColorNum(parseInt(e.target.value));
  }

  const handleCylinderNumChange = (e) => {
    setNumberOfCylinders(parseInt(e.target.value));
  }

  const generateCharts = (e) => {
    createChart();
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
        <hr />

        <button onClick={generateCharts}>Generate</button>
      </div>
    </div>
  )
}

export default Cylinder;