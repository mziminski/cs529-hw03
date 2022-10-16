var data = [], 
    Z = -5.1, 
    toggle_invert = false;

// bounds of the data
const bounds = {};

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

        if (toggle_invert == false || items.Z < Z + 0.1 && items.Z > Z - 0.1) {
            color.setRGB(vx, vy, vz);
         } else {
            color.setRGB(0, 0, 0);
         }
        
        colors.push(color.r, color.g, color.b);
    })

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


    const material = new THREE.PointsMaterial({size: 0.03, vertexColors: true, transparent: true});

    const points = new THREE.Points(geometry, material);

    scene.add(points);     
};

const createSlice = () => {
    const height = (bounds.maxY - bounds.minY) + 2;
    const width = (bounds.maxX - bounds.minX) + 2;
    
    const geometry = new THREE.PlaneGeometry(width , height);
    geometry.translate(0,0,Z);

    var color = 0;
    if (toggle_invert) { 
        color = 0x222222;
    } else {
        color = 0x555555;
    }

    const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );

    d3.select("body").on("keydown", function (event) {

        if ( event.key == 'a') {
            // move split pane (+) z direction
            Z += 0.5;
        } else if (event.key == 's') {
            // move split pane (-) z direction
            Z += 0.1;
        } else if (event.key == 'd') {
            // move split pane (-) z direction
            Z -= 0.1;
        } else if (event.key == 'f') {
            // move split pane (-) z direction
            Z -= 0.5;
        }
        // set limit for moving in (+/-) Z irection 
        th = 5.1;
        if (Z < -th) {
            Z = -th;
        } else if (Z > th) {
            Z = th;
        }

        // clear th scene
        scene.remove.apply(scene, scene.children);
        scene.remove.apply(scene2, scene2.children);
        createParticleSystem(data);
        createSlice();
        drawSlicePlot(data, Z);
    });

    scene.add( plane );
}

const drawSlicePlot = (data, Z) => {
    // background pane
    const height = (bounds.maxY - bounds.minY) + 2;
    const width = (bounds.maxX - bounds.minX) + 2;
    
    const geometryp = new THREE.PlaneGeometry(width , height);

    var color = 0;
    if (toggle_invert) { 
        color = 0x222222;
    } else {
        color = 0x555555;
    }

    const materialp = new THREE.MeshBasicMaterial( {color: color} );
    const plane = new THREE.Mesh( geometryp, materialp );
    scene2.add( plane );
    
    // point cloud
    const positions = [];
    const colors = [];

    color = new THREE.Color();

    const n = data.length;

    data.forEach(function(items) {

        concentration = items.concentration;
        u = items.U;
        v = items.V;
        w = items.W;
        // positions
        x = items.X;
        y = items.Y - 5;
        z = 1;

        // colors
        const vx = concentration * u;
        const vy = concentration * v;
        const vz = concentration * w;

        color.setRGB(vx, vy, vz);

        // push to lists
        if ( items.Z < Z + 0.1 && items.Z > Z - 0.1) {
            // console.log("hitting!");
            positions.push( x, y, z );
            colors.push(color.r, color.g, color.b);
        }
        
    })

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


    const material = new THREE.PointsMaterial({size: 0.03, vertexColors: true, transparent: true});

    const points = new THREE.Points(geometry, material);

    scene2.add(points);
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
        // create the particle system
        createParticleSystem(data);
        createSlice();
        drawSlicePlot(data, Z);
    })
};


loadData('data/058.csv');