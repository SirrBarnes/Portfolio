import useDoubleClick from "./Click";

type Props = {
  icon: string;
  label: string;
  top: number;
  left: number;
  onOpen: () => void;
};

export default function Icon({
  label,
  icon,
  top,
  left,
  onOpen,
}: Props) {
  const handleSmartClick = useDoubleClick();

  return (
    <div
      className="icon"
      onClick={() => handleSmartClick(onOpen)}
      style={{
        position: "absolute",
        left,
        top,
      }}
    >
      <div className="icon-inner">
        <img
          src={icon}
          alt={label}
          className="desktop-icon-image"
        />

        <div className="icon-label">
          {label}
        </div>
      </div>
    </div>
  );
}