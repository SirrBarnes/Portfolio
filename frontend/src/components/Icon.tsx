import useDoubleClick from "./Click";

type Props = {
  icon: string;
  label: string;
  index: number;
  onOpen: () => void;
};

const START_X = 20;
const START_Y = 20;

const ICON_SPACING_Y = 105;

export default function Icon({
  label,
  icon,
  index,
  onOpen,
}: Props) {
  const handleSmartClick = useDoubleClick();

  return (
    <div
      className="icon"
      onClick={() => handleSmartClick(onOpen)}
      style={{
        position: "absolute",
        left: START_X,
        top: START_Y + index * ICON_SPACING_Y,
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