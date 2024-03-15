'use client';
import { Button, Card, CardHeader, Image, Select, SelectItem } from '@nextui-org/react';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react'; // Import useState from React
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
  const [shirtType, setShirtType] = useState('t-shirt');
  const [color, setColor] = useState('white');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const canvasRef = useRef(null);
  const [designs, setDesigns] = useState(TestDesigns);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Create a new design object
      const newDesign = {
        name: `Custom Design ${designs.length + 1}`,
        type: `${shirtType}, ${color}`,
        image: dataUrl,
      };

      // Update the designs state with the new design
      setDesigns([...designs, newDesign]);

      localStorage.setItem('designs', JSON.stringify([...designs, newDesign]));

      // Optional: Save the canvas image as a file (if needed)
      canvas.toBlob((blob) => {
        saveAs(blob, newDesign.name + '.png');
      });
    }
  };

  useEffect(() => {
    const savedDesigns = localStorage.getItem('designs');

    if (savedDesigns) {
      setDesigns(JSON.parse(savedDesigns));
    }
  }, []);

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
          {/* Background Color dropdown with state */}
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
            canvasRef={canvasRef}
            backgroundColor={backgroundColor} // Use state variable
            shirtImage='https://owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht/productservice/tshirts_classic_herren_basic_productservice/st2020_whi.png'
          />
        </div>
      </div>
    </div>
  );
}
