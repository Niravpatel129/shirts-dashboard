import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';

const useCustomTShirtDesigner = ({
  backgroundColor = 'white',
  shirtImage,
  outputSize = { width: 700, height: 700 },
  initialSize = { width: 100, height: 100 },
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
  const [size, setSize] = useState(initialSize);
  const aspectRatio = size.width / size.height;

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
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = backgroundColor;
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = new Image();

    tshirtImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

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
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
      }

      if (designLoaded) {
        context.drawImage(designImg, position.x, position.y, size.width, size.height);
        if (showControls) {
          const handleSize = 10;
          const handleX = position.x + size.width - handleSize / 2;
          const handleY = position.y + size.height - handleSize / 2;
          context.fillRect(handleX, handleY, handleSize, handleSize);
        }
      }
    };

    tshirtImg.onload = draw;
    tshirtImg.src = shirtImage;

    if (file) {
      designImg.onload = () => {
        setDesignLoaded(true);
        draw();
      };
      designImg.src = file;
    }

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
        const newPos = {
          x: Math.min(
            Math.max((canvas.width - boundingBoxSize.width) / 2, mouseX - dragStart.x),
            (canvas.width + boundingBoxSize.width) / 2 - size.width,
          ),
          y: Math.min(
            Math.max((canvas.height - boundingBoxSize.height) / 2, mouseY - dragStart.y),
            (canvas.height + boundingBoxSize.height) / 2 - size.height,
          ),
        };
        setPosition(newPos);
        draw();
      } else if (resizeStart) {
        const dx = mouseX - resizeStart.x;
        const dy = mouseY - resizeStart.y;
        let newWidth = size.width + dx;
        let newHeight = newWidth / aspectRatio;

        // Constrain to bounding box
        newWidth = Math.min(newWidth, (canvas.width + boundingBoxSize.width) / 2 - position.x);
        newHeight = Math.min(newHeight, (canvas.height + boundingBoxSize.height) / 2 - position.y);

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
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    backgroundColor,
    file,
    shirtImage,
    designLoaded,
    position,
    size,
    outputSize,
    dragStart,
    resizeStart,
    aspectRatio,
  ]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      saveAs(blob, 'custom-t-shirt.png');
    });
  };

  const toggleGrid = () => {
    setShowGrid((prevShowGrid) => !prevShowGrid);
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
  };
};

export default useCustomTShirtDesigner;
