// 3D Tilt Effect for Image
class ImageTiltEffect {
    constructor(element) {
        this.element = element;
        this.container = element.closest('.cuadro-imagen');
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        
        // Add event listeners
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);

        this.container.style.borderRadius = window.getComputedStyle(this.element).borderRadius;
    }

    handleMouseMove(e) {
        const container = this.container;
        const image = this.element;
        
        // Get container dimensions and mouse position
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Calculate mouse position relative to container center
        const mouseX = e.clientX - rect.left - containerWidth / 2;
        const mouseY = e.clientY - rect.top - containerHeight / 2;
        
        // Calculate tilt angles
        const maxTilt = 15; // Maximum tilt angle
        const tiltX = (mouseY / (containerHeight / 2)) * maxTilt;
        const tiltY = -(mouseX / (containerWidth / 2)) * maxTilt;

         // Calculate shadow based on tilt
        const shadowOffsetX = -tiltY * 0.2; // Horizontal shadow offset
        const shadowOffsetY = tiltX * 0.2;  // Vertical shadow offset
        const shadowBlur = 10;
        const shadowSpread = (Math.abs(tiltX) + Math.abs(tiltY)) * 0.2;
        
        // Apply 3D transform
        container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        container.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px rgba(0,0,0,0.1)`;
        container.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
    }

    handleMouseLeave() {
        // Reset to original position
        this.container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        this.container.style.boxShadow = 'none';
        this.container.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
    }
}

// Apply to all images in cuadro-imagen
document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.cuadro-imagen');
    imageContainers.forEach(container => {
        const image = container.querySelector('.imagen-detalle');
        if (image) {
            new ImageTiltEffect(image);
        }
    });
});


