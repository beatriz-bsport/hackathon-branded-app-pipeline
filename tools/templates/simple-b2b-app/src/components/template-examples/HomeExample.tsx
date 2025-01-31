import { useEffect, useState } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";
import { fetchWithAuth } from "@bsport/b2b-backbone";

import OfferListExample from "./OfferListExample";
import TranslationExample from "./TranslationExample";

const HomeExample: React.FC = () => {
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
    <div className="flex p-lg flex-col flex-grow items-center justify-center min-h-screen w-full gap-xs">
      <Title htmlVariant="h1" color="critical" className="text-center">
        Simple b2b application
      </Title>
      <div className="flex flex-col gap-md">
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
          </div>
        )}
        <TranslationExample />
        <OfferListExample />
      </div>
    </div>
  );
};

export default HomeExample;
