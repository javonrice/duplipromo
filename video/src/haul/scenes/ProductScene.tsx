import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H, Product } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

// "dupli brought us here" badge
const DupliBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 320, mass: 0.4 }, from: 0, to: 1 });
  const op = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      opacity: op, transform: `scale(${s})`, transformOrigin: "center",
      display: "flex", alignItems: "center", gap: 14,
      background: H.dupliPurple, borderRadius: 40,
      padding: "16px 32px",
      boxShadow: "0 6px 28px rgba(99,102,241,0.45)",
    }}>
      <div style={{ fontFamily: outfit, fontSize: 30, fontWeight: 800, color: H.white }}>
        dupli
      </div>
      <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.3)" }} />
      <div style={{ fontFamily: outfit, fontSize: 24, fontWeight: 400, color: "rgba(255,255,255,0.9)" }}>
        brought us here
      </div>
    </div>
  );
};

// Product photo card
const PhotoCard: React.FC<{
  imgSrc: string; label: string; price: string;
  priceColor: string; chipLabel: string; chipBg: string;
  delay: number; slideFrom: "left" | "right";
}> = ({ imgSrc, label, price, priceColor, chipLabel, chipBg, delay, slideFrom }) => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [delay, delay + 22], [slideFrom === "left" ? -80 : 80, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      opacity: op, transform: `translateX(${x}px)`,
      background: H.white, borderRadius: 24,
      overflow: "hidden", flex: 1,
      boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Source chip */}
      <div style={{
        background: chipBg, padding: "12px 20px",
        fontFamily: outfit, fontSize: 22, fontWeight: 800,
        color: H.white, letterSpacing: "0.06em", textAlign: "center",
      }}>
        {chipLabel}
      </div>

      {/* Product image */}
      <div style={{ flex: 1, background: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Img
          src={staticFile(imgSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Name + price */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontFamily: outfit, fontSize: 24, fontWeight: 400, color: H.inkLight, lineHeight: 1.3, marginBottom: 10 }}>
          {label}
        </div>
        <div style={{ fontFamily: outfit, fontSize: 52, fontWeight: 800, color: priceColor, lineHeight: 1 }}>
          {price}
        </div>
      </div>
    </div>
  );
};

interface ProductSceneProps {
  product: Product;
  productNum: number; // 1-based for "find #N"
}

export const ProductScene: React.FC<ProductSceneProps> = ({ product, productNum }) => {
  const frame = useCurrentFrame();

  // Background parallax
  const bgScale = interpolate(frame, [0, 270], [1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Find #N" label
  const findOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Reaction text
  const reactOp = interpolate(frame, [60, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reactScale = interpolate(frame, [60, 78], [0.7, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  // Savings burst
  const savingOp = interpolate(frame, [110, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const savingScale = interpolate(frame, [110, 128], [0.5, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <AbsoluteFill>
      {/* Blurred aisle background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("haul/bg-aisle.jpg")}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${bgScale})`,
            filter: "blur(14px) brightness(0.5)",
          }}
        />
      </AbsoluteFill>

      {/* Content */}
      <AbsoluteFill style={{ padding: "100px 48px 80px", display: "flex", flexDirection: "column" }}>

        {/* Top bar: find # + dupli badge */}
        <div style={{
          opacity: findOp,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 36,
        }}>
          <div style={{
            background: H.white, borderRadius: 40,
            padding: "14px 32px",
            fontFamily: outfit, fontSize: 28, fontWeight: 800,
            color: H.ink,
          }}>
            find #{productNum}
          </div>
          <DupliBadge delay={30} />
        </div>

        {/* Side-by-side product cards */}
        <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
          <PhotoCard
            imgSrc={product.dtImg}
            label={product.dtName}
            price={product.dtPrice}
            priceColor={H.green}
            chipLabel="Dollar Tree"
            chipBg={H.green}
            delay={10}
            slideFrom="left"
          />

          {/* VS divider */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 16, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: outfit, fontSize: 28, fontWeight: 800,
              color: H.white, opacity: 0.9,
            }}>VS</div>
            {/* Savings burst */}
            <div style={{
              opacity: savingOp, transform: `scale(${savingScale})`,
              background: H.orange, borderRadius: "50%",
              width: 100, height: 100,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(234,88,12,0.5)",
            }}>
              <div style={{ fontFamily: outfit, fontSize: 13, color: H.white, opacity: 0.85 }}>save</div>
              <div style={{ fontFamily: outfit, fontSize: 30, fontWeight: 800, color: H.white, lineHeight: 1 }}>
                {product.saving}
              </div>
            </div>
          </div>

          <PhotoCard
            imgSrc={product.brandImg}
            label={product.brandName}
            price={product.brandPrice}
            priceColor={H.orange}
            chipLabel="Retail"
            chipBg="#9CA3AF"
            delay={18}
            slideFrom="right"
          />
        </div>

        {/* Reaction text */}
        <div style={{
          opacity: reactOp, transform: `scale(${reactScale})`,
          textAlign: "center", marginTop: 36,
          fontFamily: outfit, fontSize: 72, fontWeight: 800,
          color: H.white,
          textShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}>
          {product.reaction}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
