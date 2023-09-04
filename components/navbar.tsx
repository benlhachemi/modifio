// imports
import Image from 'next/image';
import { Button } from './ui/button';

export default function Navbar({}): any {
  return (
    <nav className="w-full backdrop-blur-md bg-white bg-opacity-60 fixed h-24 flex justify-between items-center py-10 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <Image
        alt="logo"
        className="cursor-pointer w-40"
        src="/images/logo.svg"
        height={100}
        width={170}
      />

      <div className="gap-1 md:gap-2 lg:gap-4 hidden md:flex">
        <Button variant="ghost" className="font-semibold text-md">
          Home
        </Button>
        <Button variant="ghost" className="font-semibold text-md">
          API
        </Button>
        <Button variant="ghost" className="font-semibold text-md">
          Pricing
        </Button>
        <Button variant="ghost" className="font-semibold text-md">
          About
        </Button>
      </div>

      <Button
        variant="default"
        className="rounded-full w-40 bg-orange-600"
        size="lg"
      >
        Premium
      </Button>
    </nav>
  );
}
