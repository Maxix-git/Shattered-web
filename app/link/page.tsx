import LinkBox from "../../components/LinkBox";

export const metadata = { title: "Link Account — Shattered SMP" };

export default function LinkPage() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="pixel text-lg text-[#7cfc00] mb-2" style={{ textShadow: "2px 2px 0 #0a3d0d" }}>LINK YOUR ACCOUNT</h1>
      <p className="text-[#5c8a66] text-lg mb-8">Connect your Minecraft character to Discord for community features and rewards.</p>
      <LinkBox />
    </div>
  );
}
