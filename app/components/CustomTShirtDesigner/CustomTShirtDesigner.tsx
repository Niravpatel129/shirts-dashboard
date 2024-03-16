import { Button } from '@nextui-org/react';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import FileBase64 from 'react-file-base64';

const CustomTShirtDesigner = ({
  backgroundColor = 'white',
  shirtImage,
  outputSize = { width: 600, height: 700 },
  canvasRef,
}) => {
  const boundingBoxSize = { width: 250, height: 250 }; // Easily adjustable bounding box size
  const [file, setFile] = useState('');
  const [showIndicator, setShowIndicator] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const [position, setPosition] = useState({
    x: (outputSize.width - boundingBoxSize.width) / 2,
    y: (outputSize.height - boundingBoxSize.height) / 2,
  });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = backgroundColor;
    const context = canvas.getContext('2d');
    const tshirtImg = new Image();
    const designImg = new Image();

    tshirtImg.crossOrigin = 'anonymous';
    designImg.crossOrigin = 'anonymous';

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);

      if (dragStart || resizeStart) {
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
        let newHeight = size.height + dy;

        // Constrain to bounding box
        newWidth = Math.min(newWidth, (canvas.width + boundingBoxSize.width) / 2 - position.x);
        newHeight = Math.min(newHeight, (canvas.height + boundingBoxSize.height) / 2 - position.y);

        setSize({
          width: Math.max(50, newWidth), // Ensuring a minimum size
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
    showIndicator,
    designLoaded,
    position,
    size,
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
      {designLoaded && (
        <Button onClick={() => setShowIndicator(!showIndicator)}>
          Show Resize Indicator {showIndicator ? 'On' : 'Off'}
        </Button>
      )}
      <Button onClick={handleExport}>Export Design</Button>
    </div>
  );
};

export default CustomTShirtDesigner;
