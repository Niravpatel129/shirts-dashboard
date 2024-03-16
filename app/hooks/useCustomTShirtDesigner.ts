import { useEffect, useRef, useState } from 'react';

const useCustomTShirtDesigner = ({
  backgroundColor = 'white',
  shirtImage,
  outputSize = { width: 700, height: 700 },
  initialBlendingMode = 'source-over', // default blending mode
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

        // Calculate aspect ratio and initial size based on the uploaded image
        const { width, height } = designImg;
        const aspectRatio = width / height;
        setAspectRatio(aspectRatio);

        // const maxWidth = 200; // Set a maximum width for the initial size
        // const initialWidth = Math.min(maxWidth, width);
        // const initialHeight = initialWidth / aspectRatio;
        // setSize({ width: initialWidth, height: initialHeight });
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

        // Draw the temporary canvas onto the main canvas with the specified blending mode
        context.drawImage(tempCanvas, position.x, position.y);

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
        const maxWidth = (canvas.width + boundingBoxSize.width) / 2 - position.x;
        const maxHeight = (canvas.height + boundingBoxSize.height) / 2 - position.y;

        // Prevent resizing beyond the bounding box while maintaining aspect ratio
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }

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
    position,
    size,
    outputSize,
    dragStart,
    resizeStart,
    aspectRatio,
    blendingMode,
  ]);

  const handleExport = async () => {
    // disable controls and grid
    setShowControls(false);
    setShowGrid(false);
    // wait for the next render to take the screenshot
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png', 1.0); // Get the data URL with maximum quality (1.0)

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
  const updateBlendingMode = (newBlendingMode) => {
    setBlendingMode(newBlendingMode);
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
    updateBlendingMode, // Expose the updateBlendingMode function
  };
};

export default useCustomTShirtDesigner;
