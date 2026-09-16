import { useTheme } from "../../../theme/ThemeContext";

const logoVariants = {
  md: {
    light: "/logo-light.png",
    dark: "/logo-dark.png",
    className: "w-45",
  },

  sm: {
    light: "/logo-light-sm.png",
    dark: "/logo-dark-sm.png",
    className: "w-15",
  },
};

const Logo = ({ size = "md" }) => {
  const { theme } = useTheme();

  const variant = logoVariants[size] ?? logoVariants.md;

  const logo = theme === "dark" ? variant.dark : variant.light;

  return (
    <div className="flex items-center justify-center">
      <div className={`${variant.className} shrink-0`}>
        <img
          src={logo}
          alt="LiftOS logo"
          className="size-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
