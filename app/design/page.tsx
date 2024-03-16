'use client';
import { Button, Card, CardHeader, Image, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import CustomTShirtDesigner from '../components/CustomTShirtDesigner/CustomTShirtDesigner';
import useCustomTShirtDesigner from '../hooks/useCustomTShirtDesigner';

const TestDesigns = [
  {
    name: 'Design 1',
    type: 'T-Shirt, Black',
    image: 'https://i.imgur.com/5q2gBIW.jpeg',
  },
];

export default function Design() {
  const [isMobile, setIsMobile] = useState(false);
  const [shirtType, setShirtType] = useState('t-shirt');
  const [color, setColor] = useState('white');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [designs, setDesigns] = useState(TestDesigns);
  const [width, setWidth] = useState(100);
  const [length, setLength] = useState(100);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const { file, setFile, showIndicator, setShowIndicator, canvasRef, handleExport } =
    useCustomTShirtDesigner({
      backgroundColor,
      shirtImage: 'https://i.imgur.com/5q2gBIW.jpeg',
      outputSize: { width: 600, height: 700 },
      initialSize: { width, height: length },
    });

  useEffect(() => {
    const savedDesigns = localStorage.getItem('designs');

    if (savedDesigns) {
      setDesigns(JSON.parse(savedDesigns));
    }
  }, []);

  useEffect(() => {
    console.log('🚀  window:', window);
    if (window && window.innerWidth < 568) {
      setIsMobile(true);
    }
  }, []);

  const handleCenterAlign = () => {
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const centeredX = (canvasWidth - width) / 2;
    const centeredY = (canvasHeight - length) / 2;
    setX(centeredX);
    setY(centeredY);
  };

  if (isMobile) {
    return (
      <div>
        <h1 className='text-center'>Mobile view not supported</h1>
      </div>
    );
  }

  return (
    <div className='flex'>
      <div className='sidebar w-64 h-screen text-white flex flex-col items-center'>
        {designs.map((design, index) => (
          <div className='w-full p-2' key={index}>
            <Card className='w-full cursor-pointer'>
              <CardHeader className='flex gap-3 w-full'>
                <Image
                  alt='nextui logo'
                  height={40}
                  radius='sm'
                  src={design.image || 'https://avatars.githubusercontent.com/u/86160567?s=200&v=4'}
                  width={40}
                />
                <div className='flex flex-col'>
                  <p className='text-md'>{design.name}</p>
                  <p className='text-small text-default-500'>{design.type}</p>
                </div>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
      <div className='flex-grow min-h-screen flex flex-col items-center'>
        <div className='inputs flex justify-between w-full mb-5 gap-5 p-2'>
          {/* Shirt Type dropdown with state */}
          <div className='input-item w-full'>
            <Select
              defaultSelectedKeys={['t-shirt']}
              variant='faded'
              items={[
                { value: 't-shirt', label: 't-shirt' },
                { value: 'hoodie', label: 'hoodie' },
                { value: 'jacket', label: 'jacket' },
              ]}
              label='Shirt Type'
              placeholder='Select a type'
              value={shirtType} // Bind state variable
              onChange={(e) => setShirtType(e.target.value)} // Update state on change
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
          {/* Color dropdown with state */}
          <div className='input-item w-full'>
            <Select
              variant='faded'
              items={[
                { value: 'white', label: 'white' },
                { value: 'black', label: 'black' },
                { value: 'red', label: 'red' },
              ]}
              defaultSelectedKeys={['white']}
              label='Color'
              placeholder='Select a color'
              value={color} // Bind state variable
              onChange={(e) => setColor(e.target.value)} // Update state on change
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
          <div className='input-item w-full'>
            <Select
              variant='faded'
              defaultSelectedKeys={['white']}
              items={[
                { value: 'black', label: 'black' },
                { value: 'white', label: 'white' },
              ]}
              label='Background Color'
              placeholder='Select a background color'
              value={backgroundColor} // Bind state variable
              onChange={(e) => setBackgroundColor(e.target.value)} // Update state on change
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
          {/* Your existing Button component */}
          <div className='input-item w-full flex justify-end'>
            <Button
              onClick={handleExport}
              radius='sm'
              className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg h-[54px]'
            >
              Export Design
            </Button>
          </div>
        </div>

        {/* Your existing design panel code here */}
        <div className='design-panel'>
          <CustomTShirtDesigner
            file={file}
            setFile={setFile}
            showIndicator={showIndicator}
            setShowIndicator={setShowIndicator}
            canvasRef={canvasRef}
            handleExport={handleExport}
          />
        </div>
      </div>
      <div className='right-sidebar w-64 h-screen bg-gray-200 flex flex-col p-4'>
        <h2 className='text-lg font-semibold mb-4'>Design Controls</h2>
        <div className='mb-4'>
          <span className='text-sm font-medium'>Width:</span>
          <Input
            type='number'
            placeholder='Enter width'
            className='w-full'
            value={width.toString()}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </div>
        <div className='mb-4'>
          <span className='text-sm font-medium'>Length:</span>
          <Input
            type='number'
            placeholder='Enter length'
            className='w-full'
            value={length.toString()}
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </div>
        <div className='mb-4'>
          <span className='text-sm font-medium'>X:</span>
          <Input
            type='number'
            placeholder='Enter X value'
            className='w-full'
            value={x.toString()}
            onChange={(e) => setX(parseInt(e.target.value))}
          />
        </div>
        <div className='mb-4'>
          <span className='text-sm font-medium'>Y:</span>
          <Input
            type='number'
            placeholder='Enter Y value'
            className='w-full'
            value={y.toString()}
            onChange={(e) => setY(parseInt(e.target.value))}
          />
        </div>
        <Button className='bg-blue-500 text-white' onClick={handleCenterAlign}>
          Center Align
        </Button>
      </div>
    </div>
  );
}
