export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <p className="mini-label">Guild links</p>
          <h2>Created and maintained by Bruno Machado.</h2>
          <p>
            A fantasy-themed API project with a frontend portal for exploring
            documentation, resources, and character workflows.
          </p>
        </div>

        <div className="site-footer__grid">
          <section className="site-footer__section">
            <p className="mini-label">Profiles</p>
            <div className="site-footer__links">
              <a
                className="site-footer__link-card"
                href="https://www.linkedin.com/in/brunomrs/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="site-footer__link-title">LinkedIn</span>
              </a>
              <a
                className="site-footer__link-card"
                href="https://github.com/brunomachadors"
                rel="noreferrer"
                target="_blank"
              >
                <span className="site-footer__link-title">GitHub</span>
              </a>
            </div>
          </section>

          <section className="site-footer__section">
            <p className="mini-label">Projects</p>
            <div className="site-footer__links">
              <a
                className="site-footer__link-card"
                href="https://bruno-portfolio-eight.vercel.app/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="site-footer__link-title">Portfolio</span>
              </a>
              <a
                className="site-footer__link-card"
                href="https://brunomachadors.github.io/bugbuster/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="site-footer__link-title">BugBuster</span>
              </a>
            </div>
          </section>

          <section className="site-footer__section">
            <p className="mini-label">Repository</p>
            <div className="site-footer__links">
              <a
                className="site-footer__link-card"
                href="https://github.com/brunomachadors/Adventurers-Guild-API"
                rel="noreferrer"
                target="_blank"
              >
                <span className="site-footer__link-title">Adventurers Guild API</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
