import { useEffect, useState } from "react";
import { AuthWrapper, fetchWithAuth, logout } from "@bsport/b2b-backbone";
import {
  Body,
  Button,
  ThemeProvider,
  Title,
} from "@bsport/kaizen-primitive-core";


function App() {
  const [count, setCount] = useState(0);
  const [themeData, setThemeData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the theme data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("api/v1/company/theme/me/");
        const data = await response.json();
        setThemeData(data);
      } catch (err) {
        setError("Failed to fetch theme data");
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider>
      <AuthWrapper>
        <div className="p-md">
          <Title htmlVariant="h1" color="critical">
            Simple b2b application
          </Title>
          <div className="flex flex-col gap-md">
            <Button
              onClick={() => setCount((count) => count + 1)}
              color="main"
              intent="call-to-action"
              size="md"
              iconLeft="arrow-right"
              label={`count is ${count}`}
              className="w-fit"
            />
            <Body htmlVariant="p">
              Edit <code>src/App.tsx</code> and save to test HMR
            </Body>
            <Body htmlVariant="p">
              Use our custom tailwind classes to edit style
            </Body>

            {error && (
              <Body htmlVariant="p" color="critical">
                {error}
              </Body>
            )}
            {themeData && (
              <div>
                <Body htmlVariant="p">Theme data loaded successfully</Body>
                <Button
                  onClick={logout}
                  color="critical"
                  intent="call-to-action"
                  size="md"
                  label="Logout"
                  className="w-fit"
                />
              </div>
            )}
          </div>
        </div>
      </AuthWrapper>
    </ThemeProvider>
  );
}

export default App;
