import { useState, useEffect, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  TransformControls,
  Grid as DreiGrid,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  PlusIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SwatchIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping } from "three";

// Room component with textures
function Room({ wallColor = "#ffffff", width = 5, length = 5, height = 3 }) {
  // Load all textures for concrete floor
  const [
    floorColorMap,
    floorNormalMap,
    floorRoughnessMap,
    floorDisplacementMap,
    floorAOMap,
  ] = useLoader(TextureLoader, [
    "/textures/floor/Concrete031_1K-JPG_Color.jpg",
    "/textures/floor/Concrete031_1K-JPG_NormalGL.jpg",
    "/textures/floor/Concrete031_1K-JPG_Roughness.jpg",
    "/textures/floor/Concrete031_1K-JPG_Displacement.jpg",
    "/textures/floor/Concrete031_1K-JPG_AmbientOcclusion.jpg",
  ]);

  // Load all textures for plaster walls
  const [
    plasterColorMap,
    plasterNormalMap,
    plasterRoughnessMap,
    plasterDisplacementMap,
  ] = useLoader(TextureLoader, [
    "/textures/plaster/Plaster001_1K-JPG_Color.jpg",
    "/textures/plaster/Plaster001_1K-JPG_NormalGL.jpg",
    "/textures/plaster/Plaster001_1K-JPG_Roughness.jpg",
    "/textures/plaster/Plaster001_1K-JPG_Displacement.jpg",
  ]);

  // Configure floor textures
  [
    floorColorMap,
    floorNormalMap,
    floorRoughnessMap,
    floorDisplacementMap,
    floorAOMap,
  ].forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(width / 2, length / 2);
  });

  // Configure plaster textures
  [
    plasterColorMap,
    plasterNormalMap,
    plasterRoughnessMap,
    plasterDisplacementMap,
  ].forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(width / 2, height / 2);
  });

  const halfWidth = width / 2;
  const wallY = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          map={floorColorMap}
          normalMap={floorNormalMap}
          roughnessMap={floorRoughnessMap}
          displacementMap={floorDisplacementMap}
          aoMap={floorAOMap}
          displacementScale={0.1}
          normalScale={[0.5, 0.5]}
        />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-halfWidth, wallY, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          map={plasterColorMap}
          normalMap={plasterNormalMap}
          roughnessMap={plasterRoughnessMap}
          displacementMap={plasterDisplacementMap}
          displacementScale={0.05}
          normalScale={[0.5, 0.5]}
          color={wallColor}
        />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[halfWidth, wallY, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          map={plasterColorMap}
          normalMap={plasterNormalMap}
          roughnessMap={plasterRoughnessMap}
          displacementMap={plasterDisplacementMap}
          displacementScale={0.05}
          normalScale={[0.5, 0.5]}
          color={wallColor}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, wallY, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={plasterColorMap}
          normalMap={plasterNormalMap}
          roughnessMap={plasterRoughnessMap}
          displacementMap={plasterDisplacementMap}
          displacementScale={0.05}
          normalScale={[0.5, 0.5]}
          color={wallColor}
        />
      </mesh>
    </group>
  );
}

// Draggable furniture component
function DraggableFurniture({
  modelUrl,
  position,
  rotation,
  scale,
  color,
  isSelected,
  onSelect,
}) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      <FurnitureModel
        modelPath={modelUrl}
        scale={scale}
        color={color}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) {
            onSelect();
          }
        }}
      />
      {isSelected && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="yellow"
            emissive="yellow"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Furniture catalog component
function FurnitureCatalog({ onAddFurniture }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
      >
        <PlusIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 backdrop-filter backdrop-blur-md bg-white/90 rounded-lg shadow-xl p-4">
          <h3 className="font-sans text-xl font-bold text-primary-900 mb-4">
            Available Furniture
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onAddFurniture(item);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-3 hover:bg-primary-50 rounded-lg text-left transition-colors"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-primary-600">${item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomDesigner() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef();
  const [roomFurniture, setRoomFurniture] = useState([]);
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState(null);
  const [wallColor, setWallColor] = useState("#ffffff");
  const [roomWidth, setRoomWidth] = useState(8);
  const [roomLength, setRoomLength] = useState(8);
  const [roomHeight, setRoomHeight] = useState(4);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);
  const [isCustomizingColor, setIsCustomizingColor] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (location.state?.product) {
      const { product } = location.state;
      setRoomFurniture([
        {
          ...product,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: product.customizations?.scale || 1,
          color: product.customizations?.color,
        },
      ]);
    }
  }, [location.state]);

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();

    // Handle ESC key for deselection
    if (key === "escape") {
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
      return;
    }

    // Only handle movement keys if an item is selected
    if (selectedFurnitureIndex === null) return;

    const moveSpeed = 0.1;
    const rotateSpeed = Math.PI / 4;

    setRoomFurniture((prev) => {
      return prev.map((item, i) => {
        if (i !== selectedFurnitureIndex) return item;

        const [x, y, z] = item.position;
        const [rotX, rotY, rotZ] = item.rotation;
        let newPosition = [x, y, z];
        let newRotation = [rotX, rotY, rotZ];

        switch (key) {
          case "w":
          case "arrowup":
            newPosition = [x, y, z - moveSpeed];
            break;
          case "s":
          case "arrowdown":
            newPosition = [x, y, z + moveSpeed];
            break;
          case "a":
          case "arrowleft":
            newPosition = [x - moveSpeed, y, z];
            break;
          case "d":
          case "arrowright":
            newPosition = [x + moveSpeed, y, z];
            break;
          case "q":
            newPosition = [x, y + moveSpeed, z];
            break;
          case "e":
            newPosition = [x, y - moveSpeed, z];
            break;
          case "r":
            newRotation = [rotX, rotY + rotateSpeed, rotZ];
            break;
          case "f":
            newRotation = [rotX, rotY - rotateSpeed, rotZ];
            break;
          default:
            return item;
        }

        return { ...item, position: newPosition, rotation: newRotation };
      });
    });
  };

  const handleAddFurniture = (item) => {
    setRoomFurniture((prev) => [
      ...prev,
      {
        ...item,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        color: undefined,
      },
    ]);
  };

  const handleFurnitureSelect = (index) => {
    setSelectedFurnitureIndex(index);
    setOrbitControlsEnabled(false);
  };

  const handleBackgroundClick = (event) => {
    // Only deselect if clicking on the background
    if (event.object.type === "GridHelper" || !event.object) {
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
    }
  };

  // Available colors for customization
  const availableColors = [
    "#FFFFFF", // White
    "#8B4513", // Brown
    "#808080", // Gray
    "#000000", // Black
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      {/* The header and footer are rendered by the app layout, not here */}
      <div className="flex-1 relative w-full h-full">
        {/* 3D Room fills all available space between header and footer */}
        <div
          className="absolute inset-0"
          tabIndex={0}
          ref={canvasRef}
          onKeyDown={handleKeyDown}
          style={{ outline: "none" }}
        >
          <Canvas shadows camera={{ position: [5, 5, 5], fov: 60 }}>
            <Suspense fallback={null}>
              <Room
                wallColor={wallColor}
                width={roomWidth}
                length={roomLength}
                height={roomHeight}
              />
              {roomFurniture.map((item, index) => (
                <DraggableFurniture
                  key={index}
                  modelUrl={item.modelUrl}
                  position={item.position}
                  rotation={item.rotation}
                  scale={item.scale}
                  color={item.color}
                  isSelected={selectedFurnitureIndex === index}
                  onSelect={() => {
                    handleFurnitureSelect(index);
                    setIsCustomizingColor(false);
                  }}
                />
              ))}
              <DreiGrid
                infiniteGrid
                cellSize={1}
                sectionSize={1}
                fadeDistance={30}
                fadeStrength={1}
                onClick={handleBackgroundClick}
              />
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-2, 2, -2]} intensity={0.3} color="#fff" />
              <pointLight position={[2, 2, -2]} intensity={0.3} color="#fff" />
              <pointLight position={[-2, 2, 2]} intensity={0.3} color="#fff" />
              <OrbitControls
                makeDefault
                enabled={orbitControlsEnabled}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                enableDamping={false}
              />
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        </div>

        {/* Floating Room Settings Button */}
        <button
          className="fixed bottom-8 left-8 z-50 bg-primary-500 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
          onClick={() => setSettingsOpen(true)}
          title="Room Settings"
        >
          <SwatchIcon className="h-8 w-8" />
        </button>

        {/* Room Settings Modal/Card */}
        {settingsOpen && (
          <div className="fixed bottom-8 left-8 z-50 bg-white/95 rounded-2xl shadow-2xl px-6 py-5 border border-gray-100 w-80 animate-fade-in flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans font-semibold text-primary-900 text-lg">
                Room Settings
              </span>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-5">
              {[
                {
                  label: "Width",
                  value: roomWidth,
                  setter: setRoomWidth,
                  min: 3,
                  max: 10,
                },
                {
                  label: "Length",
                  value: roomLength,
                  setter: setRoomLength,
                  min: 3,
                  max: 10,
                },
                {
                  label: "Height",
                  value: roomHeight,
                  setter: setRoomHeight,
                  min: 2,
                  max: 4,
                },
              ].map(({ label, value, setter, min, max }) => (
                <div key={label} className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-500">{value}m</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step="0.1"
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 mb-1">
                  Wall Color
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <FurnitureCatalog onAddFurniture={handleAddFurniture} />

        {/* New right-side floating controls for selected furniture */}
        {selectedFurnitureIndex !== null && (
          <div className="fixed right-8 top-1/2 z-50 -translate-y-1/2 bg-white rounded-2xl shadow-2xl px-6 py-4 flex flex-col items-center space-y-3 min-w-[280px] border border-gray-100">
            <div className="flex justify-between items-center w-full mb-1">
              <span className="font-sans font-semibold text-primary-900 text-lg">
                Selected Item
              </span>
              <button
                onClick={() => {
                  setSelectedFurnitureIndex(null);
                  setOrbitControlsEnabled(true);
                  setIsCustomizingColor(false);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-row items-center justify-center space-x-4 mb-2">
                {/* Color Customization */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setIsCustomizingColor((v) => !v)}
                    className={`p-2 rounded-full border ${
                      isCustomizingColor
                        ? "bg-primary-100 border-primary-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    title="Customize Color"
                  >
                    <SwatchIcon className="h-6 w-6 text-primary-700" />
                  </button>
                  <span className="text-xs mt-1 text-gray-500">Color</span>
                </div>
                {/* Delete Furniture */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      setRoomFurniture((prev) =>
                        prev.filter((_, idx) => idx !== selectedFurnitureIndex)
                      );
                      setSelectedFurnitureIndex(null);
                      setOrbitControlsEnabled(true);
                      setIsCustomizingColor(false);
                    }}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200"
                    title="Delete Item"
                  >
                    <TrashIcon className="h-6 w-6 text-red-500" />
                  </button>
                  <span className="text-xs mt-1 text-red-500">Delete</span>
                </div>
              </div>
              {/* Color Swatches Row */}
              {isCustomizingColor && (
                <div className="flex flex-row items-center space-x-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setRoomFurniture((prev) => {
                          const newFurniture = [...prev];
                          newFurniture[selectedFurnitureIndex] = {
                            ...newFurniture[selectedFurnitureIndex],
                            color: color,
                          };
                          return newFurniture;
                        });
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        roomFurniture[selectedFurnitureIndex]?.color === color
                          ? "border-accent-600"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Controls Legend */}
            <div className="w-full mt-2">
              <div className="flex flex-col space-y-1 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold w-20">Move:</span>
                  <span>WASD / Arrows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold w-20">Up/Down:</span>
                  <span>Q / E</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold w-20">Rotate:</span>
                  <span>R / F</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold w-20">Deselect:</span>
                  <span>ESC</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
