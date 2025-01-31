import { useState, useEffect } from "react";

import { buildUrlParams } from "@bsport/fetch";
import { Card, Title, Body } from "@bsport/kaizen-primitive-core";

import fetch from "#src/utils/fetch";

type OfferMinimal = {
  id: number | undefined;
  activity: number | undefined;
};

const OfferListExample: React.FC = () => {
  const [offers, setOffers] = useState<OfferMinimal[]>([]);

  const urlParams = buildUrlParams({
    company: "2", // Set the dev API to see data
    min_date: "2025-01-01",
    max_date: "2025-01-30",
    available: "true",
  });
  useEffect(() => {
    fetch(`api/v1/offer/${urlParams}`, {})
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        const offerList = results?.map((item: OfferMinimal) => {
          return { id: item?.id, activity: item?.activity };
        });
        setOffers(offerList);
      })
      .catch(console.error);
  }, []);

  if (!offers?.length) {
    return null;
  }

  return (
    <div className="flex flex-row mt-xl gap-md flex-wrap">
      {offers.map((offer) => (
        <Card elevated actionable={false} padding="sm" key={offer.id}>
          <Title htmlVariant="h3">Offer n°{offer.id}</Title>
          <Body htmlVariant="p">Related activity : {offer.activity}</Body>
        </Card>
      ))}
    </div>
  );
};

export default OfferListExample;
