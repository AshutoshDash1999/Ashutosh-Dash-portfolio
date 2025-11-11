'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SpaceshipViewerProps {
  className?: string;
  width?: number;
  height?: number;
}

// Extend Window interface for AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const SpaceshipViewer: React.FC<SpaceshipViewerProps> = ({
  className = '',
  width = 600,
  height = 600,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<DroneAnimationViewer | null>(null);
  const [_audioStatus, setAudioStatus] = useState<string>('Ready');

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the 3D viewer
    const viewer = new DroneAnimationViewer(containerRef.current, { width, height });
    viewerRef.current = viewer;

    // Set up audio status callback
    viewer.setAudioStatusCallback(setAudioStatus);

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose();
      }
    };
  }, [width, height, setAudioStatus]);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (viewerRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        viewerRef.current.onWindowResize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
      />

      {/* Audio elements - hidden */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio id="barrelroll-audio" preload="auto" style={{ display: 'none' }}>
        <source src="/3DAssets/barrelroll.mp3" type="audio/mpeg" />
      </audio>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio id="hover-on-audio" preload="auto" style={{ display: 'none' }}>
        <source src="/3DAssets/hover-on.mp3" type="audio/mpeg" />
      </audio>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio id="hovering-audio" preload="auto" loop style={{ display: 'none' }}>
        <source src="/3DAssets/hovering.mp3" type="audio/mpeg" />
      </audio>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio id="hover-off-audio" preload="auto" style={{ display: 'none' }}>
        <source src="/3DAssets/hover-off.mp3" type="audio/mpeg" />
      </audio>

      {/* Debug panel - uncomment for debugging */}
      {/* <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
        Audio Status: {audioStatus}
      </div> */}
    </div>
  );
};

class DroneAnimationViewer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private drone: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock: THREE.Clock;

  // Add skybox properties
  private skybox: THREE.Mesh | null = null;
  private skyboxRotationSpeed = {
    x: Math.random() * 0.0005 - 0.00025,
    y: Math.random() * 0.0005 - 0.00025,
    z: Math.random() * 0.0005 - 0.00025,
  };

  private isHovering = false;
  private animations: { [key: string]: THREE.AnimationAction } = {};
  private currentAnimation: THREE.AnimationAction | null = null;
  private previousAnimation: THREE.AnimationAction | null = null;

  // 3D viewer controls
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private cameraDistance = 0;
  private cameraAngleX = 0;
  private cameraAngleY = 0;
  private initialPinchDistance = 0;
  private initialCameraDistance = 0;

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  // Hover effect animation
  private hoverOffset = 0;
  private hoverSpeed = 1.5;
  private hoverAmplitude = 0.1;
  private originalY = 0;

  // Audio system with priority
  private audioElements: { [key: string]: HTMLAudioElement } = {};
  private audioContext: AudioContext | null = null;
  private isAudioInitialized = false;
  private hoveringAudioPlaying = false;
  private audioStatusCallback: ((status: string) => void) | null = null;

  // Audio priority system
  private audioPriority = {
    barrelroll: 4,
    hoverOn: 3,
    hoverOff: 2,
    hovering: 1,
  };
  private currentAudioPriority = 0;
  private isHoverOnPlaying = false;

  // Particle system
  private particleSystem: THREE.Points | null = null;
  private exhaustParticles: { position: THREE.Vector3; velocity: THREE.Vector3; life: number }[] =
    [];
  private particlesActive = true;

  private animationId: number | null = null;
  private container: HTMLDivElement;

  constructor(container: HTMLDivElement, options: { width: number; height: number }) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Initialize Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, options.width / options.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.init(options);
    this.setupAudio();
    this.setupEventListeners();
    this.loadDroneModel();
    this.animate();
  }

  setAudioStatusCallback(callback: (status: string) => void) {
    this.audioStatusCallback = callback;
  }

  private init(options: { width: number; height: number }) {
    // Create skybox instead of flat background
    this.createSkybox();

    // Camera
    this.camera.position.set(0.5, 1.5, -1.5);
    this.camera.lookAt(0, 0, 0);

    // Initialize camera controls based on actual position
    this.initializeCameraControls();

    // Renderer
    this.renderer.setSize(options.width, options.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.setupLights();
  }

  // New method to create a skybox
  private createSkybox() {
    const loader = new THREE.TextureLoader();

    // Load the wall.jpg texture
    loader.load(
      '/3DAssets/wall.jpg',
      texture => {
        // Create a large sphere for the skybox
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        // Flip the geometry inside out
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        // Create the skybox mesh
        this.skybox = new THREE.Mesh(geometry, material);
        this.scene.add(this.skybox);
      },
      undefined,
      error => {
        console.warn('Could not load skybox texture, using default color', error);
        this.scene.background = new THREE.Color(0xa1a1a1);
      }
    );
  }

  private initializeCameraControls() {
    const pos = this.camera.position;
    const center = new THREE.Vector3(0, 0, 0);

    this.cameraDistance = pos.distanceTo(center);
    this.cameraAngleY = Math.atan2(pos.x, pos.z);

    const horizontalDistance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    this.cameraAngleX = Math.atan2(pos.y, horizontalDistance);

    this.initialCameraDistance = this.cameraDistance;
  }

  private setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (key light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 15, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4fc3f7, 0.5);
    fillLight.position.set(-8, 5, -8);
    this.scene.add(fillLight);

    // Back light
    const backLight = new THREE.DirectionalLight(0xff6b35, 0.6);
    backLight.position.set(0, 8, -12);
    this.scene.add(backLight);

    // Side accent lights
    const leftAccent = new THREE.DirectionalLight(0x64ffda, 0.3);
    leftAccent.position.set(-15, 2, 3);
    this.scene.add(leftAccent);

    const rightAccent = new THREE.DirectionalLight(0x9c27b0, 0.3);
    rightAccent.position.set(15, 2, 3);
    this.scene.add(rightAccent);

    // Point lights
    const pointLight1 = new THREE.PointLight(0x64ffda, 1, 10);
    pointLight1.position.set(3, 3, 3);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b35, 0.8, 8);
    pointLight2.position.set(-3, 2, -3);
    this.scene.add(pointLight2);
  }

  private setupAudio() {
    // Get audio elements
    this.audioElements = {
      barrelroll: document.getElementById('barrelroll-audio') as HTMLAudioElement,
      hoverOn: document.getElementById('hover-on-audio') as HTMLAudioElement,
      hovering: document.getElementById('hovering-audio') as HTMLAudioElement,
      hoverOff: document.getElementById('hover-off-audio') as HTMLAudioElement,
    };

    // Set volume levels
    Object.values(this.audioElements).forEach(audio => {
      if (audio) audio.volume = 0.7;
    });

    if (this.audioElements.hovering) {
      this.audioElements.hovering.volume = 0.5;
    }

    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    const initAudio = () => {
      if (!this.isAudioInitialized) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isAudioInitialized = true;
        this.updateAudioStatus('Initialized');

        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
      }
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
  }

  private updateAudioStatus(status: string) {
    if (this.audioStatusCallback) {
      this.audioStatusCallback(status);
    }
  }

  private async playAudio(
    audioType: string,
    options: { allowOverlap?: boolean; continuing?: boolean; force?: boolean } = {}
  ) {
    if (!this.isAudioInitialized) return;

    const audio = this.audioElements[audioType];
    if (!audio) return;

    const priority = this.audioPriority[audioType as keyof typeof this.audioPriority] || 0;

    // Check priority - only play if higher priority or forced
    if (!options.force && priority <= this.currentAudioPriority && this.currentAudioPriority > 0) {
      return;
    }

    // Special handling for hover-on to prevent spam
    if (audioType === 'hoverOn') {
      if (this.isHoverOnPlaying) return;
      this.isHoverOnPlaying = true;
    }

    try {
      // Stop lower priority audio
      if (priority > this.currentAudioPriority) {
        this.stopAllAudio();
      }

      // Stop audio if it's already playing (except for specific cases)
      if (!audio.paused && !options.allowOverlap) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Reset to beginning if not continuing
      if (!options.continuing) {
        audio.currentTime = 0;
      }

      this.currentAudioPriority = priority;
      await audio.play();
      this.updateAudioStatus(`Playing ${audioType} (Priority: ${priority})`);

      // Set up event listener for when audio ends
      const onEnded = () => {
        if (audioType === 'hoverOn') {
          this.isHoverOnPlaying = false;
        }
        if (this.currentAudioPriority === priority) {
          this.currentAudioPriority = 0;
        }
        audio.removeEventListener('ended', onEnded);
      };
      audio.addEventListener('ended', onEnded);
    } catch (error) {
      console.warn(`Error playing ${audioType} audio:`, error);
      this.updateAudioStatus(`Error: ${audioType}`);
      this.currentAudioPriority = 0;
      if (audioType === 'hoverOn') {
        this.isHoverOnPlaying = false;
      }
    }
  }

  private stopAudio(audioType: string) {
    const audio = this.audioElements[audioType];
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;

      if (audioType === 'hoverOn') {
        this.isHoverOnPlaying = false;
      }

      const priority = this.audioPriority[audioType as keyof typeof this.audioPriority] || 0;
      if (this.currentAudioPriority === priority) {
        this.currentAudioPriority = 0;
      }

      this.updateAudioStatus(`Stopped ${audioType}`);
    }
  }

  private stopAllAudio() {
    Object.keys(this.audioElements).forEach(audioType => {
      this.stopAudio(audioType);
    });
    this.currentAudioPriority = 0;
    this.hoveringAudioPlaying = false;
    this.isHoverOnPlaying = false;
  }

  private handleHoverEnter() {
    // Play hover-on sound with priority
    this.playAudio('hoverOn');

    const hoverOnAudio = this.audioElements.hoverOn;
    const startHoveringLoop = () => {
      if (this.isHovering && !this.hoveringAudioPlaying) {
        this.hoveringAudioPlaying = true;
        this.playAudio('hovering');
      }
      hoverOnAudio?.removeEventListener('ended', startHoveringLoop);
    };

    hoverOnAudio?.addEventListener('ended', startHoveringLoop);

    // Fallback - start hovering loop after a short delay
    setTimeout(() => {
      if (this.isHovering && !this.hoveringAudioPlaying) {
        this.hoveringAudioPlaying = true;
        this.playAudio('hovering');
      }
    }, 300);
  }

  private handleHoverExit() {
    // Stop hovering loop immediately
    if (this.hoveringAudioPlaying) {
      this.stopAudio('hovering');
      this.hoveringAudioPlaying = false;
    }

    // Play hover-off sound with high priority
    this.playAudio('hoverOff', { force: true });
  }

  private handleClick() {
    // Play barrel roll sound with highest priority
    this.playAudio('barrelroll', { force: true });
  }

  private async loadDroneModel() {
    try {
      // Use dynamic import to avoid HMR issues
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();

      loader.load(
        '/3DAssets/spaceship.glb',
        gltf => this.onModelLoaded(gltf),
        undefined,
        error => console.error('Error loading model:', error)
      );
    } catch (error) {
      console.error('Error loading GLTFLoader:', error);
    }
  }

  private onModelLoaded(gltf: GLTF) {
    const model = gltf.scene;
    model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          this.enhanceEmissiveMaterial(child.material);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    model.scale.multiplyScalar(scale);

    model.position.sub(center.multiplyScalar(scale));
    this.originalY = model.position.y;

    this.scene.add(model);
    this.drone = model;

    // Setup particle system after model is loaded
    this.setupParticleSystem();

    this.setupAnimations(gltf.animations);
  }

  private enhanceEmissiveMaterial(material: THREE.Material | THREE.Material[]) {
    const materials = Array.isArray(material) ? material : [material];

    materials.forEach(mat => {
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        if (mat.emissive && mat.emissive.getHex() > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 1, 2);
          mat.needsUpdate = true;

          const emissiveStrength = mat.emissive.r + mat.emissive.g + mat.emissive.b;
          if (emissiveStrength > 1.5) {
            mat.emissiveIntensity = 3;
          }
        }
      }
    });
  }

  private setupParticleSystem() {
    if (!this.drone) return;

    // Find exhaust position - look for objects with "exhaust" in name
    let exhaustPosition = new THREE.Vector3(0, 0, 0.5); // Default position

    this.drone.traverse(child => {
      if (child.name && child.name.toLowerCase().includes('exhaust')) {
        exhaustPosition = child.position.clone();
      }
    });

    // Create particle geometry
    const particleCount = 100;
    const particles = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particles[i] = exhaustPosition.x + (Math.random() - 0.5) * 0.1;
      particles[i + 1] = exhaustPosition.y + (Math.random() - 0.5) * 0.1;
      particles[i + 2] = exhaustPosition.z + (Math.random() - 0.5) * 0.1;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

    // Create particle material - blue glowing particles
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00aaff,
      size: 0.02,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
    });

    // Create particle system
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);

    // Initialize particle data - particles flow to the RIGHT
    this.exhaustParticles = [];
    for (let i = 0; i < particleCount; i++) {
      this.exhaustParticles.push({
        position: new THREE.Vector3(
          exhaustPosition.x + (Math.random() - 0.5) * 0.05,
          exhaustPosition.y + (Math.random() - 0.5) * 0.05,
          exhaustPosition.z
        ),
        velocity: new THREE.Vector3(
          Math.random() * 0.15 + 0.05, // Flow to the RIGHT (positive X)
          (Math.random() - 0.5) * 0.02, // Small random Y movement
          (Math.random() - 0.5) * 0.02 // Small random Z movement
        ),
        life: Math.random(),
      });
    }
  }

  private updateParticleSystem(deltaTime: number) {
    if (!this.particleSystem || !this.drone || !this.particlesActive) return;

    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;

    // Find exhaust position relative to drone
    const exhaustWorldPosition = new THREE.Vector3(0, 0, 0.5);
    this.drone.traverse(child => {
      if (
        child.name &&
        child.name.toLowerCase().includes('exhaust') &&
        child instanceof THREE.Object3D
      ) {
        child.getWorldPosition(exhaustWorldPosition);
      }
    });

    // Update particles
    for (let i = 0; i < this.exhaustParticles.length; i++) {
      const particle = this.exhaustParticles[i];

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime * 60));

      // Update life
      particle.life -= deltaTime * 2;

      // Reset particle if life is over
      if (particle.life <= 0) {
        particle.position.copy(exhaustWorldPosition);
        particle.position.add(
          new THREE.Vector3((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, 0)
        );
        // Reset velocity to flow LEFT
        particle.velocity.set(
          -(Math.random() * 0.15 + 0.05), // Flow to the LEFT (negative X)
          (Math.random() - 0.5) * 0.02, // Small random Y movement
          (Math.random() - 0.5) * 0.02 // Small random Z movement
        );
        particle.life = 1;
      }

      // Update geometry
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  private setupAnimations(animationClips: THREE.AnimationClip[]) {
    if (!animationClips || animationClips.length === 0 || !this.drone) {
      // Create default idle animation if no clips available
      this.createIdleAnimation();
      return;
    }

    this.mixer = new THREE.AnimationMixer(this.drone);

    animationClips.forEach((clip, index) => {
      const action = this.mixer!.clipAction(clip);
      if (index === 0) {
        // Animation 1 (click) - play once
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      } else {
        // Animation 2 and 3 - loop
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
      this.animations[`animation${index + 1}`] = action;
    });

    // Start with idle animation (animation3 or fallback)
    this.playAnimation('animation3');
  }

  private createIdleAnimation() {
    // Create a basic idle animation if no clips are loaded
    if (!this.drone) return;

    const idleKeyframe = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 1, 2],
      [0, 0, 0, 0, 0.1, 0, 0, 0, 0]
    );

    const idleClip = new THREE.AnimationClip('idle', 2, [idleKeyframe]);
    this.mixer = new THREE.AnimationMixer(this.drone);
    const idleAction = this.mixer.clipAction(idleClip);
    idleAction.setLoop(THREE.LoopRepeat, Infinity);
    this.animations['animation3'] = idleAction;
    this.playAnimation('animation3');
  }

  private playAnimation(animationName: string) {
    if (!this.animations[animationName]) {
      console.warn(`Animation ${animationName} not found`);
      return;
    }

    // Store the current animation as previous (unless it's animation1)
    if (this.currentAnimation && animationName !== 'animation1') {
      this.previousAnimation = this.currentAnimation;
    }

    // Stop current animation safely
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }

    // Start new animation
    this.currentAnimation = this.animations[animationName];
    if (this.currentAnimation) {
      this.currentAnimation.reset().play();

      // If this is animation1, set up listener to return to idle when finished
      if (animationName === 'animation1') {
        const onFinished = () => {
          this.mixer?.removeEventListener('finished', onFinished);
          // Always return to idle animation (animation3)
          this.playAnimation('animation3');
        };
        this.mixer?.addEventListener('finished', onFinished);
      }
    }
  }

  private setupEventListeners() {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    canvas.addEventListener('click', this.onMouseClick.bind(this));
    canvas.addEventListener('wheel', this.onWheel.bind(this));

    canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

    canvas.addEventListener('touchstart', e => e.preventDefault());
    canvas.addEventListener('touchmove', e => e.preventDefault());
  }

  private onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (!this.isDragging) {
      this.checkDroneHover();
    }

    if (this.isDragging) {
      const deltaX = event.clientX - this.previousMousePosition.x;
      const deltaY = event.clientY - this.previousMousePosition.y;

      this.cameraAngleY -= deltaX * 0.01;
      this.cameraAngleX -= deltaY * 0.01;

      this.cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraAngleX));

      this.updateCameraPosition();

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  private onMouseUp() {
    this.isDragging = false;
  }

  private onMouseClick() {
    if (!this.isDragging && this.drone) {
      // Check if clicking on the spaceship
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.drone, true);

      if (intersects.length > 0) {
        // Clicked on spaceship - play animation and sound
        this.playAnimation('animation1');
        this.handleClick();
        this.resumeEffects(); // Ensure effects are active
      } else {
        // Clicked outside spaceship - stop all effects
        this.stopAllEffects();
      }
    }
  }

  private onMouseLeave() {
    this.isDragging = false;
    if (this.isHovering) {
      this.isHovering = false;
      this.handleHoverExit();
      this.playAnimation('animation3');
    }
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault();
    this.cameraDistance += event.deltaY * 0.01;
    this.cameraDistance = Math.max(2, Math.min(20, this.cameraDistance));
    this.updateCameraPosition();
  }

  private onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      this.initialPinchDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      this.initialCameraDistance = this.cameraDistance;
    }
  }

  private onTouchMove(event: TouchEvent) {
    if (event.touches.length === 1 && this.isDragging) {
      const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

      this.cameraAngleY -= deltaX * 0.01;
      this.cameraAngleX -= deltaY * 0.01;

      this.cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraAngleX));

      this.updateCameraPosition();

      this.previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentPinchDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      const scale = currentPinchDistance / this.initialPinchDistance;
      this.cameraDistance = this.initialCameraDistance / scale;
      this.cameraDistance = Math.max(2, Math.min(20, this.cameraDistance));
      this.updateCameraPosition();
    }

    if (event.touches.length === 1 && !this.isDragging) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
      this.checkDroneHover();
    }
  }

  private onTouchEnd(event: TouchEvent) {
    if (event.touches.length === 0) {
      this.isDragging = false;
      if (event.changedTouches.length === 1 && this.drone) {
        // Check if touching the spaceship
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.changedTouches[0].clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.changedTouches[0].clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.drone, true);

        if (intersects.length > 0) {
          // Touched spaceship - play animation and sound
          this.playAnimation('animation1');
          this.handleClick();
          this.resumeEffects(); // Ensure effects are active
        } else {
          // Touched outside spaceship - stop all effects
          this.stopAllEffects();
        }
      }
    }
  }

  private updateCameraPosition() {
    const x = this.cameraDistance * Math.sin(this.cameraAngleY) * Math.cos(this.cameraAngleX);
    const y = this.cameraDistance * Math.sin(this.cameraAngleX);
    const z = this.cameraDistance * Math.cos(this.cameraAngleY) * Math.cos(this.cameraAngleX);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  private checkDroneHover() {
    if (!this.drone) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.drone, true);

    const wasHovering = this.isHovering;
    this.isHovering = intersects.length > 0;

    if (this.isHovering && !wasHovering) {
      // Started hovering - play Animation 2 and handle audio
      this.playAnimation('animation2');
      this.handleHoverEnter();
    } else if (!this.isHovering && wasHovering) {
      // Stopped hovering - return to idle Animation 3 and handle audio
      this.playAnimation('animation3');
      this.handleHoverExit();
    }
  }

  private updateHoverEffect(deltaTime: number) {
    if (!this.drone) return;

    // Only apply hover effect when playing Animation 3 (idle)
    if (this.currentAnimation === this.animations['animation3']) {
      this.hoverOffset += deltaTime * this.hoverSpeed;
      const yOffset = Math.sin(this.hoverOffset) * this.hoverAmplitude;
      this.drone.position.y = this.originalY + yOffset;
    }
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    if (this.skybox) {
      this.skybox.rotation.x += this.skyboxRotationSpeed.x;
      this.skybox.rotation.y += this.skyboxRotationSpeed.y;
      this.skybox.rotation.z += this.skyboxRotationSpeed.z;
    }
    this.updateHoverEffect(deltaTime);
    this.updateParticleSystem(deltaTime);
    this.renderer.render(this.scene, this.camera);
  };

  public onWindowResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public stopAllEffects() {
    // Stop all animations
    if (this.currentAnimation) {
      this.currentAnimation.stop();
      this.currentAnimation = null;
    }

    // Stop all audio
    this.stopAllAudio();

    // Stop particles
    this.particlesActive = false;

    // Hide particle system
    if (this.particleSystem) {
      this.particleSystem.visible = false;
    }
  }

  public resumeEffects() {
    // Resume particles
    this.particlesActive = true;

    // Show particle system
    if (this.particleSystem) {
      this.particleSystem.visible = true;
    }

    // Resume idle animation
    this.playAnimation('animation3');
  }

  public dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Stop all audio
    this.stopAllAudio();

    // Clean up particle system
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      (this.particleSystem.material as THREE.Material).dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }

    if (this.scene) {
      this.scene.clear();
    }
  }
}

export default SpaceshipViewer;
