import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import fragShaderSource from './shaders/frag.glsl';

import vertShaderSource from './shaders/vert.glsl';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const CrapShader = {
  uniforms: {
    tDiffuse: null,
    u_time: { value: 0 },
  },
  vertexShader: vertShaderSource,
  fragmentShader: fragShaderSource,
};

class App {
  constructor() {
    this.width = sizes.width;
    this.height = sizes.height;
    this.container = document.getElementById('app');
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );

    this.camera.position.set(
      97.35241182051257,
      42.93025519764828,
      17.705496643757666
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xcccccc);

    this.composer = new EffectComposer(this.renderer);

    this.renderPass = new RenderPass(this.scene, this.camera);

    this.composer.addPass(this.renderPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(gammaCorrectionPass);

    this.customPass = new ShaderPass(CrapShader);

    this.composer.addPass(this.customPass);

    this.time = 0;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(
      -13.49106448130002,
      41.495096260695156,
      15.395572008748038
    );
    this.gltfLoader = new GLTFLoader();
    this.draco = new DRACOLoader();
    this.draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.gltfLoader.setDRACOLoader(this.draco);

    this.init();
  }

  init() {
    this.addModels();
    this.addLights();
    this.resize();
    this.render();
    this.setupResize();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addModels() {
    this.gltfLoader.load('room.glb', (gltf) => {
      const model = gltf.scene;

      model.scale.set(2, 2, 2);
      this.scene.add(model);
    });
  }

  addLights() {
    const ambLight = new THREE.AmbientLight('#FFFFFF', 0.3);
    this.scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight('#FFFFFF', 2.5);
    dirLight.position.set(0.5, 0, 0.866);
    this.scene.add(dirLight);

    this.scene.traverse(function (object) {
      if (object.isLight) {
        object.visible = true;
      }
    });
  }

  render() {
    this.time += 0.05;
    this.customPass.uniforms.u_time.value += this.time;
    this.controls.update();
    this.composer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
}
new App();
