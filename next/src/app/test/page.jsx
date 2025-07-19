'use client'
import { useSwipeable } from 'react-swipeable';

export default function MyComponent () {
  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swiped Left'),
    onSwipedRight: () => console.log('Swiped Right'),
    onSwipedUp: () => console.log('Swiped Up'),
    onSwipedDown: () => console.log('Swiped Down'),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="h-screen w-full bg-gray-100">
      <p>Swipe on me!</p>
    </div>
  );
};
