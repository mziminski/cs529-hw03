
// Canvas
const canvas = document.querySelector('canvas#flow-scene');
const canvas2 = document.querySelector('canvas#flow-slice');

// Scene
const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(0,2,20);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
light2.position.set(0,2,20);
scene2.add(light2);

// Sizes
const sizes = {
    width: window.innerWidth * 0.49,
    height: window.innerHeight * 0.85
};

window.addEventListener('resize', () =>
{
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    camera2.aspect = sizes.width / sizes.height
    camera2.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    renderer2.setSize(sizes.width, sizes.height)
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.set(15,10,10);
camera.lookAt(0,0,0);
scene.add(camera);

const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );
camera2.position.set(0,0,9);
camera2.lookAt(0,0,0);
scene2.add(camera2);


//  Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

const renderer2 = new THREE.WebGLRenderer({
    canvas: canvas2
});

renderer.setSize(sizes.width, sizes.height);
renderer2.setSize(sizes.width, sizes.height);
// sets up the background color
color = 0xA9A9A9;

const invertColor = () => {
    toggle_invert = !toggle_invert;

    if (toggle_invert) {
        color = 0xA9A9A9;
    } else {
        color = 0x000000
    }

    renderer.setClearColor(color);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer2.setClearColor(color);
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.remove.apply(scene, scene.children);
    scene.remove.apply(scene2, scene2.children);
    createParticleSystem(data);
    createSlice();
    drawSlicePlot(data, Z);
}

const reset_pos = () => {
    Z = -5.1;

    scene.remove.apply(scene, scene.children);
    scene.remove.apply(scene2, scene2.children);
    createParticleSystem(data);
    createSlice();
    drawSlicePlot(data, Z);
}

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();


// Animate
const animate = () =>
{
    // render the scenes
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);

    // Call animate for each frame
    window.requestAnimationFrame(animate);
};

animate();