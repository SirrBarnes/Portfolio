import { useEffect } from "react";
import about from '../icons/about.png';
import projects from '../icons/computer.png';
import contact from '../icons/contact.png';
import gallery from '../icons/gallery.png';
import minesweep from '../icons/minesweep.png';
import terminal from '../icons/terminal.png';
import resume from '../icons/txt.png';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenApp: (type: any) => void;
};

export default function StartMenu({ open, onClose, onOpenApp }: Props) {
  // close when clicking outside

  useEffect(() => {
    const handleClick = () => onClose();
    if (open) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="start-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="start-menu-sidebar">SergioOS</div>

      <div className="start-menu-content">
        <div
          className="start-menu-item"
          onClick={() => onOpenApp("Projects")}>
          <img 
            src={projects} 
            alt="Projects"
            className="start-menu-icon"
          />
          <span>Projects</span>
        </div>

        <div
          className="start-menu-item"
          onClick={() => onOpenApp("About")}>
          <img 
            src={about}
            alt="About"
            className="start-menu-icon"
          />
          <span>About</span>
        </div>

        <div
          className="start-menu-item"
          onClick={() => onOpenApp("Terminal")}>
          <img 
            src={terminal}
            alt="Terminal"
            className="start-menu-icon"
          />
          <span>Terminal</span>
        </div>

        <div
          className="start-menu-item"
          onClick={() => onOpenApp("Contact")}>
          <img 
            src={contact} 
            alt="Contact"
            className="start-menu-icon"
          />
          <span>Contact</span>
        </div>

        <div
          className="start-menu-item"
          onClick={() => onOpenApp("Resume")}>
          <img 
            src={resume}
            alt="Resume"
            className="start-menu-icon"
          />
          <span>Resume</span>
        </div>

        <div
          className="start-menu-item"
          onClick={() => onOpenApp("Gallery")}>
          <img 
            src={gallery}
            alt="Gallery"
            className="start-menu-icon"
          />
          <span>Gallery</span>
        </div>

        {/* <div
          className="start-menu-item"
          onClick={() => onOpenApp("Minesweeper")}>
          <img 
            src={minesweep}
            alt="Minesweeper"
            className="start-menu-icon"
          />
          <span>Minesweeper</span>
        </div> */}

      </div>
    </div>
  );
}