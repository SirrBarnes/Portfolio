type Props = {
  children: React.ReactNode;
};

export default function CRTScreen({ children }: Props) {
  return (
    <div className="crt-wrapper">
      <div className="crt-screen">{children}</div>
    </div>
  );
}