const CustomTShirtDesigner = ({
  outputSize = { width: 700, height: 700 },
  file,
  setFile,
  canvasRef,
}) => {
  // Function to convert a file to base64
  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      fileToBase64(file, setFile);
    } else {
      alert('Please select an image file.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Custom T-Shirt Designer</h1>
      <input
        type='file'
        accept='image/*' // Accept only image files
        onChange={handleFileChange}
        style={{ display: 'block', margin: '20px auto' }}
      />
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
