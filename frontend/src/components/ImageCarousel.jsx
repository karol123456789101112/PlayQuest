import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const images = [
  './images/portal_2_banner.png',
  './images/prince_of_persia_the_sands_of_time_banner2.png',
  './images/vampire_the_masquerade_bloodlines_banner.png',
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // zmiana co 4 sekundy

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: '700px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {images.map((src, index) => (
        <Box
          key={index}
          component="img"
          src={src}
          alt={`Banner ${index + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: current === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: current === index ? 1 : 0,
          }}
        />
      ))}
    </Box>
  );
}
