// @ts-nocheck
import React from 'react';

import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';
import { PaymentPack } from '#libs/payment-packs/types';
import { Props, CarouselForStorybook } from '#csscomponents/Carousel';

const CarouselTemplate = (args: Props<PaymentPack>) => <Carousel {...args} />;

export const ItemCarousel = CarouselTemplate.bind({});
ItemCarousel.args = {
  data: PaymentPackStorybookListFactory(10),
  renderItem: (item: Partial<PaymentPack>, index: number) => {
    return <div key={index}>{item.name}</div>;
  },
};

export const PictureCarousel = CarouselTemplate.bind({});
PictureCarousel.args = {
  data: [
    {
      id: 1,
      link: 'https://img.freepik.com/free-photo/white-cloud-blue-sky-sea_74190-4488.jpg',
    },
    {
      id: 2,
      link: 'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg',
    },
    {
      id: 3,
      link: 'https://img.freepik.com/free-photo/white-cloud-blue-sky-sea_74190-4488.jpg',
    },
    {
      id: 4,
      link: 'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg',
    },
    {
      id: 5,
      link: 'https://img.freepik.com/free-photo/white-cloud-blue-sky-sea_74190-4488.jpg',
    },
    {
      id: 6,
      link: 'https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg',
    },
  ],
  renderItem: (item: { link: string; id: number }, index: number) => {
    return (
      <div
        key={item.id}
        style={{
          backgroundImage: `url(${item.link})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          height: '200px',
        }}
      />
    );
  },
};

export default {
  title: 'Components/css-only/Carousel',
  component: CarouselForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
