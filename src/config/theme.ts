export const themeConfig = {
  colors: {
    burgundy: {
      deep: "#140306",
      base: "#220509",
      accent: "#3d0b13",
      light: "#500e19",
      darkest: "#090103",
    },
    wine: {
      dark: "#1d0509",
      rich: "#3a0810",
      vivid: "#5a111e",
    },
    gold: {
      foil: "#e5c57b",
      bright: "#f7e6b5",
      metallic: "#caa24d",
      antique: "#916b2e",
      shadow: "#5f4422",
      glow: "rgba(229, 197, 123, 0.45)",
      subtleGlow: "rgba(229, 197, 123, 0.15)",
    },
    paper: {
      card: "#120306",
      cardBorder: "rgba(229, 197, 123, 0.4)",
      envelopeBase: "#1a0408",
      envelopePocket: "#25060c",
      envelopeFlap: "#2a070e",
      envelopeInterior: "#300810",
    },
  },
  typography: {
    fontFamilies: {
      serif: "var(--font-cormorant), Cinzel, Georgia, serif",
      display: "var(--font-playfair), Cormorant Garamond, serif",
      sans: "var(--font-montserrat), system-ui, sans-serif",
    },
    letterSpacing: {
      widest: "0.28em",
      wide: "0.18em",
      luxury: "0.22em",
    },
  },
  gradients: {
    goldFoil: "linear-gradient(115deg, #caa24d 0%, #fff0c7 25%, #e5c57b 50%, #916b2e 75%, #f7e6b5 100%)",
    goldText: "linear-gradient(135deg, #fff2d1 0%, #e2c070 35%, #b28a38 70%, #fcedc5 100%)",
    envelopeVelvet: "linear-gradient(145deg, #300810 0%, #1c0408 50%, #0d0104 100%)",
    flapVelvet: "linear-gradient(180deg, #380a12 0%, #220509 100%)",
    interiorFoil: "radial-gradient(circle at 50% 30%, #450c16 0%, #1d0408 100%)",
  },
  dimensions: {
    mobileEnvelopeWidth: 350, // optimal for 375px - 414px
    mobileEnvelopeHeight: 235,
    mobileCardWidth: 320,
    mobileCardHeight: 460,
  },
};
