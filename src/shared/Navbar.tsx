import Link from "next/link";
import { FluidMenu } from "@/components/ui/fluid-menu";

const navItems = [
  { href: "/popular", label: "Popular" },
  { href: "/image", label: "Image" },
  { href: "/video", label: "Video" },
  { href: "/pdf", label: "PDF" },
  { href: "/barcode", label: "Barcode" },
  { href: "/text", label: "Text" },
];

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Web Utilities
          </Link>
          <FluidMenu items={navItems} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
