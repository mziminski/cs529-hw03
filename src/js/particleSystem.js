var data = [];

// bounds of the data
const bounds = {};

// create the containment box.
// This cylinder is only to guide development.
// TODO: Remove after the data has been rendered
const createCylinder = () => {
    // get the radius and height based on the data bounds
    const radius = (bounds.maxX - bounds.minX) / 2.0 + 1;
    const height = (bounds.maxY - bounds.minY) + 1;

    // create a cylinder to contain the particle system
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const cylinder = new THREE.Mesh(geometry, material);

    // add the containment to the scene
    scene.add(cylinder);
};

// creates the particle system
const createParticleSystem = (data) => {

    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    const n = data.length;

    data.forEach(function(items) {

        concentration = items.concentration;
        u = items.U;
        v = items.V;
        w = items.W;
        // positions
        x = items.X;
        y = items.Y - 5;
        z = items.Z;
        
        positions.push( x, y, z );

        // colors
        const vx = concentration * u;
        const vy = concentration * v;
        const vz = concentration * w;

        color.setRGB(vx, vy, vz);

        colors.push(color.r, color.g, color.b);
    })

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


    const material = new THREE.PointsMaterial({size: 0.06, vertexColors: true, transparent: true});

    const points = new THREE.Points(geometry, material);

    scene.add(points);     
};

const createSlice = () => {
    const height = (bounds.maxY - bounds.minY) + 2;
    const width = (bounds.maxX - bounds.minX) + 2;
    
    const geometry = new THREE.PlaneGeometry(width , height);
    const material = new THREE.MeshBasicMaterial( {color: 0xe5e5e5, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
}

const drawSlicePlot = (data) => {
    
    const height = (bounds.maxY - bounds.minY) + 2;
    const width = (bounds.maxX - bounds.minX) + 2;
    
    const geometry = new THREE.PlaneGeometry(width , height);
    const material = new THREE.MeshBasicMaterial( {color: 0xe5e5e5, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    scene2.add( plane );
} 

const loadData = (file) => {

    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
            bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
            bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

            // get the max bounds
            bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
            bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
            bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points2),
                Z: Number(d.Points1),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity2),
                W: Number(d.velocity1)
            })
        });
        // draw the containment cylinder
        // TODO: Remove after the data has been rendered
        // createCylinder();
        // create the particle system
        createParticleSystem(data);
        createSlice();
        drawSlicePlot(data);
    })
};


loadData('data/058.csv');