import FileBase64 from 'react-file-base64';

const CustomTShirtDesigner = ({
  outputSize = { width: 700, height: 700 },
  file,
  setFile,
  showIndicator,
  setShowIndicator,
  canvasRef,
  handleExport,
}) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Custom T-Shirt Designer</h1>
      <FileBase64 multiple={false} onDone={({ base64 }) => setFile(base64)} />
      <canvas
        ref={canvasRef}
        width={outputSize.width}
        height={outputSize.height}
        style={{
          border: '1px solid #ccc',
          margin: '20px auto',
          display: 'block',
        }}
      ></canvas>
    </div>
  );
};

export default CustomTShirtDesigner;
