type Props = {
  onOpenApp: (type: "Projects" | "Resume" | "Contact") => void;
};

export default function About({ onOpenApp }: Props) {
  return (
    <div className="about-root">
      <h2 className="about-name">Sergio Torres</h2>
      <p className="about-title">Full Stack Software Developer</p>

      <div className="about-divider" />

      <section className="about-section">
        <h3>Who I Am</h3>
        <p>
          I'm a full stack developer who enjoys the space where hands-on
          engineering meets code. I started out building robots and writing
          computer vision programs on a Raspberry Pi, and that same curiosity
          about how things work under the hood has carried straight into web
          development. I care a lot about clean, fluid user experiences, and
          I genuinely enjoy feedback &mdash; it's one of the fastest ways I
          grow as a developer.
        </p>
      </section>

      <section className="about-section">
        <h3>What I Do</h3>
        <p>
          Right now I'm working as a freelance fullstack developer for
          Autoshops.com, where I split my time between frontend features that
          make the user experience smoother and backend work like building
          new API routes and wiring up data-driven status checks. Before
          that, I built educational web apps for nonprofits, managed a
          WordPress site end-to-end, and led a robotics coding team that
          taught a robot to tell clean surfaces from dirty ones using
          OpenCV.
        </p>
      </section>

      <section className="about-section">
        <h3>Tech I Work With</h3>
        <div className="about-tags">
          {[
            "React", "TypeScript", "JavaScript", "Node.js", "C#", "C++",
            "Python", "PostgreSQL", "Sequelize", "GraphQL", "HTML", "CSS",
            "Bootstrap", "Supabase", "Git", "Maya 3D", "Visual Studio Code", "Python", "Unity 2D & 3D", 
          ].map((tag) => (
            <span key={tag} className="about-tag">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h3>Education</h3>
        <p>
          B.S. in Computer Science &mdash; Florida Polytechnic University
          <br />
          Coding Bootcamp Certificate &mdash; University of Central Florida
        </p>
      </section>

      <div className="about-divider" />

      <p className="about-footer">
        Curious to see what I've built? Check out the{" "}
        <strong className="about-link" onClick={() => onOpenApp("Projects")}>
          Projects
        </strong>{" "}
        folder, grab a copy of my{" "}
        <strong className="about-link" onClick={() => onOpenApp("Resume")}>
          Resume
        </strong>
        , or send me an email through{" "}
        <strong className="about-link" onClick={() => onOpenApp("Contact")}>
          Contact
        </strong>
        .
      </p>
    </div>
  );
}