import { Button, useTheme } from "@bsport/kaizen-primitive-core";

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      color="main"
      intent="call-to-action"
      size="md"
      className="w-fit"
      label={theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};

export default ThemeSelector;
