import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Provedi Boost</h3>
            <p className="text-sm text-muted-foreground">
              AI 기반 맘카페 마케팅 자동화 플랫폼
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">제품</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">기능</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">요금제</a></li>
              <li><Link to="/app" className="hover:text-primary transition-colors">대시보드</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">회사</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">소개</Link></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">문의</a></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">블로그</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">도움말</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Provedi Boost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
