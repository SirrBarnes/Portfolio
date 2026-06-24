type Props = {
  onOpenApp: (type: "About" | "Resume" | "Contact") => void;
};

export default function Projects({ onOpenApp }: Props) {
  return (
    <div className="about-root">
      <h2 className="about-name">Projects</h2>
      <p className="about-title">A few things I've built</p>

      <div className="about-divider" />

      <section className="about-section project-block">
        <h3>YuGiOh Collection / Deck Builder</h3>

        <img src={"./YuGiOh.png"} alt="YuGiOh Deck Builder" className="project-image" />
        <img src={"./YuGiOh-Search.png"} alt="YuGiOh Deck Builder screenshot" className="project-image" />


        <p>
          A web app that helps users manage their card collection and build
          decks. Users can search for cards, add them to an existing deck or
          start a new one, and create a profile with a custom avatar and bio.
        </p>

        <p>
          I led front-end development with a focus on mobile-first
          responsiveness, designed and implemented the full login/logout
          flow (front-end and back-end), built the user profile system with
          custom avatars, and created a searchable, filterable card display.
          I also helped teammates debug backend issues along the way.
        </p>

        <div className="about-tags">
          {["HTML", "CSS", "JavaScript", "React", "Bootstrap", "ESLint", "Node.js", "JWTs", "YGOPRO API", "GraphQL", "MongoDB"].map((tag) => (
            <span key={tag} className="about-tag">{tag}</span>
          ))}
        </div>

        <a
          className="about-link project-repo-link"
          href="https://github.com/SirrBarnes/Yu-Gi-Oh_Deck_Builder"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub →
        </a>
      </section>

      <div className="about-divider" />

      <section className="about-section project-block">
        <h3>NeetPlan</h3>

        <img src={"./Neet.png"} alt="Neet Plan" className="project-image" />


        <p>
          A daily planning app that lets users create, edit, and manage tasks
          throughout the day, plus check current weather to help plan
          activities accordingly. Built with scalability in mind, leaving
          room for future features to support life organization.
        </p>

        <p>
          I worked on the settings and about pages as well as login/logout
          functionality, handling both front-end styling and back-end routes
          for user customization, authentication, and smooth transitions
          throughout the app.
        </p>

        <div className="about-tags">
          {["HTML", "CSS", "JavaScript", "React", "PostgreSQL", "Sequelize", "Bootstrap", "Node.js", "JWTs", "OpenWeather API", "API Ninja"].map((tag) => (
            <span key={tag} className="about-tag">{tag}</span>
          ))}
        </div>

        <a
          className="about-link project-repo-link"
          href="https://github.com/SirrBarnes/NeetPlan"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub →
        </a>
      </section>

      <div className="about-divider" />

      <section className="about-section project-block">
        <h3>Autoshops.com</h3>

        <img src={"./Autoshops.png"} alt="Autoshops" className="project-image" />
        <img src={"./Autoshops-Map.png"} alt="Autoshops Map" className="project-image" />

        <p>
          Freelance fullstack work for a small startup, joining their
          development team to build and improve both frontend and backend
          code structure. Primarily focused on frontend features to make the
          user experience more fluid, while also expanding into backend
          logic like new API routes and date-based status checks.
        </p>

        <div className="about-tags">
          {["React", "TypeScript", "Node.js", "APIs"].map((tag) => (
            <span key={tag} className="about-tag">{tag}</span>
          ))}
        </div>
      </section>

      <div className="about-divider" />

      <p className="about-footer">
        Want to know more about me? Visit my{" "}
        <strong className="about-link" onClick={() => onOpenApp("About")}>
          About
        </strong>{" "}
        page, check out my{" "}
        <strong className="about-link" onClick={() => onOpenApp("Resume")}>
          Resume
        </strong>
        , or reach out through{" "}
        <strong className="about-link" onClick={() => onOpenApp("Contact")}>
          Contact
        </strong>
        .
      </p>
    </div >
  );
}