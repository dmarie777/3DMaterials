import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

///Textures///

//Texture loaders
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = './static/textures/door/color.jpg';
const doorAlphaTexture = './static/textures/door/alpha.jpg';
const doorAmbientOclusionTexture = './static/textures/door/ambientOcclusion.jpg';
const doorHeightTexture = './static/textures/door/height.jpg';
const doorNormalTexture = './static/textures/door/normal.jpg';
const doorRoughnessTexture = './static/textures/door/roughness.jpg';
const matcapTexture = './static/textures/matcaps/1.png';
const gradientTexture = './static/textures/door/3.jpg';
const doorTexture = textureLoader.load(doorColorTexture);
// Color space
doorTexture.colorSpace = THREE.SRGBColorSpace;

const hdrTextureURL = './static/textures/environmentMap/2k.hdr';

const matcapFromSpline = './static/textures/matcaps/8.png'
const t1 = textureLoader.load(matcapFromSpline);

export default class sketch {
    constructor() {

        //sizes
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.radius = 10;
        this.numberEl = 20;

        //HDR 
        this.RGBELoader = new RGBELoader();

        //camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
        this.camera.position.z = 3
        this.camera.position.y = 2

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

        //settings
        this.resize();

        //Background
        this.addBackground();
        this.postProcessing();

        //Materials
        this.colorMaterials = Array.from({length: this.numberEl}, x => new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, }));
        this.matcapMaterials = Array.from({length: this.numberEl}, x => new THREE.MeshMatcapMaterial({ matcap: t1 }));
        this.textureMaterials = Array.from({length: this.numberEl}, x => new THREE.MeshBasicMaterial( { map:doorTexture, side: THREE.DoubleSide }));

        //Add objects
        this.planes = [];
        this.spheres = [];
        this.torusArr = [];
        // this.createArrOfMat()

        this.addObjToArr(this.planes, this.createPlane.bind(this), this.colorMaterials);
        this.addObjToArr(this.spheres, this.createSphere.bind(this), this.matcapMaterials);
        this.addObjToArr(this.torusArr, this.createTorus.bind(this), this.textureMaterials);
        this.addObjToScene(this.planes);
        this.addObjToScene(this.spheres);
        this.addObjToScene(this.torusArr);

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

    addObjToArr (objArr, createObj, materialArr) {
        for (let i = 0; i< this.numberEl; i ++) {
            
            objArr.push(createObj(this.radius*Math.cos(Math.PI/2 -Math.PI/(this.numberEl)*i), 0 ,-(this.radius - this.radius*Math.sin(Math.PI/2 -i*Math.PI/(this.numberEl))), materialArr[i]));
            objArr.push(createObj(-this.radius*Math.cos(Math.PI/2 -Math.PI/(this.numberEl)*(i+1)), 0 ,-(this.radius - this.radius*Math.sin(Math.PI/2 -(i+1)*Math.PI/(this.numberEl))), materialArr[i]));
        }

    }

    createPlane(x,y,z, material) {

        //create mesh
         this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1,1),
            material
        )
        this.plane.position.x = x;
        this.plane.position.z = z;
        return  this.plane;
    }

    createSphere(x,y,z, material) {

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            material
        )
        this.sphere.position.x = x;
        this.sphere.position.z = z;
        return this.sphere
    }

    createTorus(x,y,z, material) {

        this.torus = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, .2, 16, 34),
            material
        )
        this.torus.position.x = x;
        this.torus.position.z = z;
        return this.torus
    }

    addObjToScene(objArr) {
        objArr.forEach(obj => this.scene.add(obj));
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();
        //Animations
        for (let i=0; i<6; i++) {
            this.planes[i].rotation.z = 0.5 * elapsedTime;
            this.planes[i].rotation.y = 0.5 * elapsedTime;
            this.spheres[i].rotation.y = 0.5 * elapsedTime;
            this.torusArr[i].rotation.y = 0.5 * elapsedTime;
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

}

new sketch()