'use client';
import { Button, Card, CardHeader, Image, Select, SelectItem } from '@nextui-org/react';
import CustomTShirtDesigner from '../components/CustomTShirtDesigner/CustomTShirtDesigner';

export default function Design() {
  return (
    <div className='flex'>
      <div className='sidebar w-64 h-screen text-white flex flex-col items-center'>
        <div className='w-full p-2'>
          <Card className='w-full cursor-pointer'>
            <CardHeader className='flex gap-3 w-full'>
              <Image
                alt='nextui logo'
                height={40}
                radius='sm'
                src='https://avatars.githubusercontent.com/u/86160567?s=200&v=4'
                width={40}
              />
              <div className='flex flex-col'>
                <p className='text-md'>Design 1</p>
                <p className='text-small text-default-500'>T-Shirt, Black</p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className='flex-grow min-h-screen flex flex-col items-center'>
        <div className='inputs flex justify-between w-full mb-5 gap-5 p-2'>
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
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
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
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
          <div className='input-item w-full'>
            <Select
              variant='faded'
              items={[
                { value: 'black', label: 'black' },
                { value: 'white', label: 'white' },
              ]}
              label='Background Color'
              placeholder='Select a background color'
              className=''
              color='secondary'
            >
              {(animal) => <SelectItem key={animal.value}>{animal.label}</SelectItem>}
            </Select>
          </div>
          <div className='input-item w-full flex justify-end'>
            <Button
              radius='sm'
              className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg h-[54px]'
            >
              Export Design
            </Button>
          </div>
        </div>

        <div className='design-panel'>
          <CustomTShirtDesigner
            backgroundColor='white'
            shirtImage='https://owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht/productservice/tshirts_classic_herren_basic_productservice/st2020_whi.png'
          />
          {/* <div className='panel border-2 bg-gradient-to-tr from-pink-500 to-yellow-500 h-[700px] w-[700px]'></div> */}
        </div>
      </div>
    </div>
  );
}
