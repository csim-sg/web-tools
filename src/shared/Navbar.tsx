import Link from "next/link";
import { FluidMenu } from "@/components/ui/fluid-menu";

const navigationItems = [
  { href: "/utilities/calculator", label: "Calculator" },
  { href: "/utilities/currency", label: "Currency" },
  { href: "/games/mtg", label: "MTG Tools" },
  { href: "/image", label: "Image Tools" },
  { href: "/video", label: "Video Tools" },
  { href: "/pdf", label: "PDF Tools" },
];

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Web Utilities
          </Link>
          <FluidMenu items={navigationItems} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
