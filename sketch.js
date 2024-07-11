import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene();

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Material
const material = new THREE.MeshBasicMaterial()

//Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    material
)
plane.position.x = 1.5;
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, .2, 16, 34),
    material
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

