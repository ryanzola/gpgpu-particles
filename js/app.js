import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

import test from '../test.jpg';

export default class Sketch {
  constructor(options) {
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 10);
    this.camera.position.z = 1;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.setupResize();
    this.resize();
    this.addObjects();
    this.render()
  }

  addObjects() {
    this.size = 32;
    this.number = this.size * this.size;
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.number * 3);
    const uvs = new Float32Array(this.number * 2);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;

        positions[ 3 * index + 0 ] = (j / this.size) - 0.5;
        positions[ 3 * index + 1 ] = (i / this.size) - 0.5;
        positions[ 3 * index + 2 ] = 0;

        uvs[ 2 * index + 0 ] = j / (this.size - 1);
        uvs[ 2 * index + 1 ] = i / (this.size - 1);
      }
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const data = new Float32Array(this.number * 4);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;

        data[ 4 * index + 0 ] = Math.random() * 2 - 1;
        data[ 4 * index + 1 ] = Math.random() * 2 - 1;
        data[ 4 * index + 2 ] = 0;
        data[ 4 * index + 3 ] = 1;
      }
    }

    this.positions = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
    this.positions.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        // uTexture: { value: new THREE.TextureLoader().load(test) }
        uTexture: { value: this.positions }
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.mesh = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render() {
    this.time += 0.05;

    this.material.uniforms.time.value = this.time;

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById('container') });