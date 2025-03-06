import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Web Utilities
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/utils/calculator">Calculator</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/utils/currency">Currency</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/utils/interest">Interest</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/utils/loan">Loan</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/games/mtg">MTG Tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 