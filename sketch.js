import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector('.webgl')

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Scene
const scene = new THREE.Scene();

//Texture
const textureLoader = new THREE.TextureLoader() 
const doorColorTexture = textureLoader.load('./static/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./static/textures/door/alpha.jpg')
const doorAmbientOclusionTexture = textureLoader.load('./static/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./static/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./static/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('./static/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./static/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('./static/textures/door/3.jpg')

//Material
const basicMaterial = new THREE.MeshBasicMaterial(
    {
        map:doorColorTexture,
        side: THREE.DoubleSide,
    }
)

//Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    basicMaterial
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    basicMaterial
)
plane.position.x = 1.5;
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, .2, 16, 34),
    basicMaterial
)
torus.position.x = -1.5;

scene.add(sphere, plane, torus);

//create camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.z = 2
scene.add(camera)

//Add renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
)

//resize event
window.addEventListener('resize', () => {
    //Update sizes 
    size.width = window.innerWidth
    size.height = window.innerHeight

    //Update camera 
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    //Update renderer 
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
renderer.setSize(size.width, size.height)

//Add orbit controls
const controls = new OrbitControls( camera, renderer.domElement )
controls.enableDamping = true

const clock = new THREE.Clock;

function animate() {
    requestAnimationFrame(animate)

    const elapsedTime = clock.getElapsedTime();
    //Animations
    plane.rotation.y = 0.5 * elapsedTime; 
    torus.rotation.y = 0.5 * elapsedTime; 
    sphere.rotation.y = 0.5 * elapsedTime; 

    controls.update()
    renderer.render(scene, camera)
}

animate()

