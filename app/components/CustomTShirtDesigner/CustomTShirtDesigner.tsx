// CustomTShirtDesigner.js
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import FileBase64 from 'react-file-base64';

const CustomTShirtDesigner = ({
  backgroundColor = 'white',
  shirtImage,
  outputSize = { width: 600, height: 700 },
}) => {
  const [file, setFile] = useState('');
  const [showIndicator, setShowIndicator] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ width: 300, height: 400 });
  const aspectRatio = size.width / size.height;
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('useEffect');

    const canvas = canvasRef.current;
    canvas.style.backgroundColor = backgroundColor; // Set the background color
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = new Image();

    tshirtImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);
      if (designLoaded) {
        context.drawImage(designImg, position.x, position.y, size.width, size.height);

        // Draw resize handle
        const handleSize = 10;
        const handleX = position.x + size.width - handleSize / 2;
        const handleY = position.y + size.height - handleSize / 2;
        context.fillRect(handleX, handleY, handleSize, handleSize);
        context.fillStyle = !showIndicator ? 'transparent' : 'blue';
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
        setDragStart(null);
      } else if (
        mouseX > position.x &&
        mouseX < position.x + size.width &&
        mouseY > position.y &&
        mouseY < position.y + size.height
      ) {
        setDragStart({ x: mouseX - position.x, y: mouseY - position.y });
        setResizeStart(null);
      }
    };

    const handleMouseMove = (e) => {
      if (dragStart) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setPosition({
          x: mouseX - dragStart.x,
          y: mouseY - dragStart.y,
        });
        draw();
      } else if (resizeStart) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (e.shiftKey) {
          // Maintain aspect ratio
          let diff = Math.min(mouseX - resizeStart.x, mouseY - resizeStart.y);
          setSize({
            width: Math.max(100, size.width + diff),
            height: Math.max(100, size.height + diff / aspectRatio),
          });
        } else {
          setSize({
            width: Math.max(100, size.width + mouseX - resizeStart.x),
            height: Math.max(100, size.height + mouseY - resizeStart.y),
          });
        }
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
    showIndicator,
    designLoaded,
    position,
    size,
    aspectRatio,
    canvasRef,
    outputSize,
    dragStart,
    resizeStart,
  ]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      saveAs(blob, 'custom-t-shirt.png');
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Custom T-Shirt Designer</h1>
      <FileBase64 multiple={false} onDone={({ base64 }) => setFile(base64)} />
      <canvas
        ref={canvasRef}
        width={outputSize.width}
        height={outputSize.height}
        style={{ border: '1px solid #ccc', margin: '20px auto', display: 'block' }}
      ></canvas>
      <button onClick={() => setShowIndicator(!showIndicator)}>
        Show Indicator {showIndicator ? 'On' : 'Off'}
      </button>
      <button onClick={handleExport}>Export</button>
    </div>
  );
};

export default CustomTShirtDesigner;
