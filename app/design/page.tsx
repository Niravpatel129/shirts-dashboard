'use client';
import { Button, Card, CardHeader, Image, Select, SelectItem } from '@nextui-org/react';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react'; // Import useState from React
import CustomTShirtDesigner from '../components/CustomTShirtDesigner/CustomTShirtDesigner';

const TestDesigns = [
  {
    name: 'Design 1',
    type: 'T-Shirt, Black',
    image:
      'https://owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht/productservice/tshirts_classic_herren_basic_productservice/st2020_whi.png',
  },
];

export default function Design() {
  // State variables for each dropdown
  const [shirtType, setShirtType] = useState('');
  const [color, setColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const canvasRef = useRef(null);
  const [designs, setDesigns] = useState(TestDesigns);

  // Define handleExport function here
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        saveAs(blob, 'custom-t-shirt.png');
      });
    }
  };

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
          {/* Background Color dropdown with state */}
          <div className='input-item w-full'>
            <Select
              variant='faded'
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
            canvasRef={canvasRef}
            backgroundColor={backgroundColor} // Use state variable
            shirtImage='https://owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht/productservice/tshirts_classic_herren_basic_productservice/st2020_whi.png'
          />
        </div>
      </div>
    </div>
  );
}
