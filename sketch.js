import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

//Textures
const doorColorTexture = './static/textures/door/color.jpg';
const doorAlphaTexture = './static/textures/door/alpha.jpg';
const doorAmbientOclusionTexture = './static/textures/door/ambientOcclusion.jpg';
const doorHeightTexture = './static/textures/door/height.jpg';
const doorNormalTexture = './static/textures/door/normal.jpg';
const doorRoughnessTexture = './static/textures/door/roughness.jpg';
const matcapTexture = './static/textures/matcaps/1.png';
const gradientTexture = './static/textures/door/3.jpg';

const hdrTextureURL = './static/textures/environmentMap/2k.hdr';

export default class sketch {
    constructor() {

        //sizes
        this.height = window.innerHeight;
        this.width = window.innerWidth;

        //camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
        this.camera.position.z = 1

        //Scene
        this.scene = new THREE.Scene();

        //renderer
        this.canvas = document.querySelector('.webgl');
        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas
            }
        )
        this.renderer.setSize( this.width, this.height );

        //Controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true;

        //Texture loaders
        this.textureLoader = new THREE.TextureLoader();
        this.RGBELoader = new RGBELoader();

        //settings
        this.resize();

        //Background
        this.addBackground();
        this.postProcessing();

        //Add objects
        this.addPlane();
        this.addSphere();
        this.addTorus();

        //render
        this.clock = new THREE.Clock;
        this.animate();

    }

    resize() {
        window.addEventListener('resize', () => {
        //Update sizes
        this.width = window.innerWidth
        this.height = window.innerHeight

        //Update camera
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

        //Update renderer
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
    }

    addBackground() {
        // Load HDR Texture for the background
        this.RGBELoader.load(hdrTextureURL, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture;
        }.bind(this) )
    }

    postProcessing() {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
    }

    addPlane() {
        //load texture
        const t1 = this.textureLoader.load(doorColorTexture);
        // Color space
        t1.colorSpace = THREE.SRGBColorSpace;
        //create material
        this.basicMaterial = new THREE.MeshBasicMaterial(
            {
                map:t1,
                side: THREE.DoubleSide,
            }
        )
        //create mesh
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1,1),
            this.basicMaterial
        )
        this.plane.position.x = 1.5;
        this.scene.add( this.plane)
    }

    addSphere() {

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        )
        this.scene.add( this.sphere);
    }

    addTorus() {

        this.torus = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, .2, 16, 34),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        )
        this.torus.position.x = -1.5;
        this.scene.add( this.torus);

    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();
        //Animations
        this.plane.rotation.y = 0.5 * elapsedTime;
        this.torus.rotation.y = 0.5 * elapsedTime;
        this.sphere.rotation.y = 0.5 * elapsedTime;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

}

new sketch()