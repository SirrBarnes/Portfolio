type GalleryItem = {
  name: string;
  src: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  { name: "Photo 1.jpg", src: "/gallery/placeholder1.jpg" },
  { name: "Photo 2.jpg", src: "/gallery/placeholder2.jpg" },
  { name: "Photo 3.jpg", src: "/gallery/placeholder3.jpg" },
  { name: "Photo 4.jpg", src: "/gallery/placeholder4.jpg" },
  { name: "Photo 5.jpg", src: "/gallery/placeholder5.jpg" },
  { name: "Photo 6.jpg", src: "/gallery/placeholder6.jpg" },
];

type Props = {
  onOpenImage: (src: string, name: string) => void;
};

export default function Gallery({ onOpenImage }: Props) {
  return (
    <div className="gallery-root">
      {/* TOOLBAR */}
      <div className="gallery-toolbar">
        <button className="gallery-toolbar-btn">⬅ Back</button>
        <button className="gallery-toolbar-btn">➡ Forward</button>
        <div className="gallery-toolbar-divider" />
        <span className="gallery-path">C:\My Pictures\Gallery</span>
      </div>

      {/* CONTENT */}
      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.name}
            className="gallery-item"
            onDoubleClick={() => onOpenImage(item.src, item.name)}
          >
            <div className="gallery-item-thumb">
              <img src={item.src} alt={item.name} />
            </div>
            <span className="gallery-item-name">{item.name}</span>
          </button>
        ))}
      </div>

      {/* STATUS BAR */}
      <div className="gallery-statusbar">
        {GALLERY_ITEMS.length} object(s)
      </div>
    </div>
  );
}