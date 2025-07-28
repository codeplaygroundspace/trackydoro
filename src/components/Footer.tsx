const Footer = () => {
  return (
    <footer className="mt-24 py-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/codeplaygroundspace/trackydoro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Contribute
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>©Trackydoro 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
