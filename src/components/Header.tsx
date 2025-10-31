import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">Provedi Boost</div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            기능
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            요금제
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            문의
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost">로그인</Button>
          </Link>
          <Link to="/auth">
            <Button variant="hero" size="sm">무료 시작하기</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
