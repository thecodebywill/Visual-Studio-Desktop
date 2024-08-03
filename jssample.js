// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('heroCanvas') });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
//Bubble play
document.addEventListener("DOMContentLoaded", function() {
    createBubbles(document.querySelectorAll('.bubbles'));
});

function createBubbles(bubbleContainers) {
    bubbleContainers.forEach(container => {
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            container.appendChild(bubble);
        }
    });
}
//boiling water
// jssample.js or your main JS file
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = 200; // Adjust height as needed
    document.querySelector('#animated-background').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x++) {
            const y = Math.sin(x * 0.05) * 10 + canvas.height / 2;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        drawWave();
        requestAnimationFrame(animate);
    }

    animate();
});
