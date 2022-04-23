import {useEffect, useState} from 'react';

import {useWindowDimensions} from 'react-native';

const MARGIN = 30;
const SPACE = 18;
const BASE = 1024;

const caculate = (width: number, n: number): number => {
  return Math.floor((width - MARGIN * 2 - SPACE * (n - 1)) / n);
};
const useWidth = () => {
  const [width, setWidth] = useState<number>(BASE);
  const [height, setHeight] = useState<number>(BASE * 0.4);
  const [w1, setW1] = useState<number>(caculate(BASE, 1));
  const [w2, setW2] = useState<number>(caculate(BASE, 2));
  const [w3, setW3] = useState<number>(caculate(BASE, 3));
  const [w4, setW4] = useState<number>(caculate(BASE, 4));
  const [w5, setW5] = useState<number>(caculate(BASE, 5));
  const [w6, setW6] = useState<number>(caculate(BASE, 6));

  const window = useWindowDimensions();

  useEffect(() => {
    setWidth(window.width);
    setHeight(window.height);
    setW1(caculate(window.width, 1));
    setW2(caculate(window.width, 2));
    setW3(caculate(window.width, 3));
    setW4(caculate(window.width, 4));
    setW5(caculate(window.width, 5));
    setW6(caculate(window.width, 6));
  }, [window]);
  return {w1, w2, w3, w4, w5, w6, space: SPACE, margin: MARGIN, width, height};
};

export default useWidth;
