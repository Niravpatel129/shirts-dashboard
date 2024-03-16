// useCustomTShirtDesigner.js
import { useEffect, useRef, useState } from 'react';
const SNAP_THRESHOLD = 5; // Adjust this value as needed

const useCustomTShirtDesigner = ({
  backgroundColor = 'white',
  shirtImage,
  outputSize = { width: 1600, height: 1600 },
  initialBlendingMode = 'source-over', // default blending mode
  initialSnapToCenter = false, // default snap-to-center value
}) => {
  const canvasRef = useRef(null);
  const [boundingBoxSize, setBoundingBoxSize] = useState({ width: 250, height: 250 });
  const [file, setFile] = useState('');
  const [designLoaded, setDesignLoaded] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [position, setPosition] = useState({
    x: (outputSize.width - boundingBoxSize.width) / 2,
    y: (outputSize.height - boundingBoxSize.height) / 2,
  });
  const [size, setSize] = useState({ width: 100, height: 100 }); // Update initial size
  const [aspectRatio, setAspectRatio] = useState(1); // Add aspectRatio state
  const [blendingMode, setBlendingMode] = useState(initialBlendingMode);
  const [snapToCenter, setSnapToCenter] = useState(initialSnapToCenter); // Add snapToCenter state
  const designImgRef = useRef(null);

  useEffect(() => {
    // center design to the bounding box
    const canvas = canvasRef.current;
    const { width, height } = canvas;
    const x = (width - size.width) / 2;
    const y = (height - size.height) / 2;
    setPosition({ x, y });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (file) {
      const designImg = new Image();
      designImg.onload = () => {
        console.log('Design loaded');
        setDesignLoaded(true);
        designImgRef.current = designImg;

        const { width, height } = designImg;
        const aspectRatio = width / height;
        setAspectRatio(aspectRatio);
      };
      designImg.src = file;
    }
  }, [file]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = backgroundColor;
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = designImgRef.current;

    tshirtImg.crossOrigin = 'anonymous';
    if (designImg) {
      designImg.crossOrigin = 'anonymous';
    }

    const drawGrid = () => {
      if (!showGrid) return;

      const gridSize = 50;
      const numHorizontalLines = Math.floor(canvas.height / gridSize);
      const numVerticalLines = Math.floor(canvas.width / gridSize);

      context.beginPath();
      context.strokeStyle = 'lightgray';
      context.lineWidth = 1;

      // Draw horizontal lines
      for (let i = 0; i <= numHorizontalLines; i++) {
        const y = i * gridSize;
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }

      // Draw vertical lines
      for (let i = 0; i <= numVerticalLines; i++) {
        const x = i * gridSize;
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }

      context.stroke();
    };

    const drawCenterLines = () => {
      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;

      context.beginPath();
      context.strokeStyle = 'blue'; // Set the color of the center lines
      context.lineWidth = 1;

      // Draw vertical center line
      context.moveTo(canvasCenterX, 0);
      context.lineTo(canvasCenterX, canvas.height);

      // Draw horizontal center line
      context.moveTo(0, canvasCenterY);
      context.lineTo(canvas.width, canvasCenterY);

      context.stroke();
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);

      drawGrid();

      if (showControls) {
        const boundingBox = {
          x: (canvas.width - boundingBoxSize.width) / 2,
          y: (canvas.height - boundingBoxSize.height) / 2,
          width: boundingBoxSize.width,
          height: boundingBoxSize.height,
        };
        context.strokeStyle = 'red'; // Set the stroke color to red
        context.lineWidth = 2;
        context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
      }

      if (designLoaded) {
        // Create a temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size.width;
        tempCanvas.height = size.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the design on the temporary canvas
        tempCtx.drawImage(designImg, 0, 0, size.width, size.height);

        // Set the blending mode on the main canvas
        context.globalCompositeOperation = blendingMode;

        // Clip the design to the bounding box
        context.save();
        context.beginPath();
        context.rect(
          (canvas.width - boundingBoxSize.width) / 2,
          (canvas.height - boundingBoxSize.height) / 2,
          boundingBoxSize.width,
          boundingBoxSize.height,
        );
        context.clip();

        // Draw the temporary canvas onto the main canvas with the specified blending mode
        context.drawImage(tempCanvas, position.x, position.y);

        context.restore();

        if (showControls) {
          // only if dragging
          if (dragStart && snapToCenter) {
            drawCenterLines();
          }

          const handleSize = 10;
          const handleX = position.x + size.width - handleSize / 2;
          const handleY = position.y + size.height - handleSize / 2;
          context.fillRect(handleX, handleY, handleSize, handleSize);
        }
      }
    };

    tshirtImg.onload = draw;
    tshirtImg.src = shirtImage;

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX > position.x + size.width - 10 &&
        mouseX < position.x + size.width + 10 &&
        mouseY > position.y + size.height - 10 &&
        mouseY < position.y + size.height + 10
      ) {
        setResizeStart({ x: mouseX, y: mouseY });

        return;
      }

      if (
        mouseX > position.x &&
        mouseX < position.x + size.width &&
        mouseY > position.y &&
        mouseY < position.y + size.height
      ) {
        setDragStart({ x: mouseX - position.x, y: mouseY - position.y });
      }

      if (
        mouseX > position.x &&
        mouseX < position.x + size.width &&
        mouseY > position.y &&
        mouseY < position.y + size.height
      ) {
        setShowControls(true);
      } else {
        setShowControls(false);
        setDragStart(null);
        setResizeStart(null);
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (dragStart) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        let newPosX = mouseX - dragStart.x;
        let newPosY = mouseY - dragStart.y;

        if (snapToCenter) {
          // Check if the design is close to the center horizontally
          if (
            newPosX >= canvasCenterX - size.width / 2 - SNAP_THRESHOLD &&
            newPosX <= canvasCenterX - size.width / 2 + SNAP_THRESHOLD
          ) {
            newPosX = canvasCenterX - size.width / 2;
          }

          // Check if the design is close to the center vertically
          if (
            newPosY >= canvasCenterY - size.height / 2 - SNAP_THRESHOLD &&
            newPosY <= canvasCenterY - size.height / 2 + SNAP_THRESHOLD
          ) {
            newPosY = canvasCenterY - size.height / 2;
          }
        }

        const newPos = {
          x: newPosX,
          y: newPosY,
        };

        setPosition(newPos);
        draw();
      } else if (resizeStart) {
        const dx = mouseX - resizeStart.x;
        const dy = mouseY - resizeStart.y;
        let newWidth = size.width + dx;
        let newHeight = newWidth / aspectRatio;

        setSize({
          width: Math.max(50, newWidth),
          height: Math.max(50, newHeight),
        });

        setResizeStart({ x: mouseX, y: mouseY });
        draw();
      }
    };

    const handleMouseUp = () => {
      setDragStart(null);
      setResizeStart(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    backgroundColor,
    shirtImage,
    designLoaded,
    outputSize,
    aspectRatio,
    blendingMode,
    snapToCenter,
  ]);

  const handleExport = async () => {
    // disable controls and grid
    setShowControls(false);
    setShowGrid(false);

    // Create a new canvas with the desired output size
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = outputSize.width;
    exportCanvas.height = outputSize.height;
    const exportCtx = exportCanvas.getContext('2d');

    // Draw the t-shirt image on the export canvas
    const tshirtImg = new Image();
    tshirtImg.crossOrigin = 'anonymous';
    tshirtImg.src = shirtImage;
    await new Promise((resolve) => (tshirtImg.onload = resolve));
    exportCtx.drawImage(tshirtImg, 0, 0, outputSize.width, outputSize.height);

    // Draw the design on the export canvas
    if (designLoaded) {
      const designImg = designImgRef.current;
      const exportDesignSize = {
        width: (size.width * outputSize.width) / canvasRef.current.width,
        height: (size.height * outputSize.height) / canvasRef.current.height,
      };
      const exportPosition = {
        x: (position.x * outputSize.width) / canvasRef.current.width,
        y: (position.y * outputSize.height) / canvasRef.current.height,
      };

      exportCtx.globalCompositeOperation = blendingMode as GlobalCompositeOperation;
      exportCtx.drawImage(
        designImg,
        exportPosition.x,
        exportPosition.y,
        exportDesignSize.width,
        exportDesignSize.height,
      );
    }

    // Get the data URL of the export canvas
    const dataURL = exportCanvas.toDataURL('image/png', 1.0);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'custom-t-shirt.png';

    // Trigger the download
    link.click();
  };

  const toggleGrid = () => {
    setShowGrid((prevShowGrid) => !prevShowGrid);
  };

  // Add a function to update the blending mode
  const updateBlendingMode = (newBlendingMode: GlobalCompositeOperation) => {
    setBlendingMode(newBlendingMode);
  };

  // Add a function to toggle the snap-to-center feature
  const toggleSnapToCenter = () => {
    setSnapToCenter((prevSnapToCenter) => !prevSnapToCenter);
  };

  return {
    file,
    setFile,
    canvasRef,
    handleExport,
    designPosition: position,
    designSize: size,
    resizeDesign: setSize,
    repositionDesign: setPosition,
    setBoundingBoxSize,
    toggleGrid,
    blendingMode,
    updateBlendingMode,
    snapToCenter,
    toggleSnapToCenter,
  };
};

export default useCustomTShirtDesigner;
