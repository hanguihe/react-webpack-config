import { FC, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import Title from '@/components/text';
import logo from '@/assets/logo.svg';
import './style.less';

const Home: FC = () => {
  const [value, setState] = useState(1);

  const timer = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setState((state) => state + 1);
    }, 1000);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return (
    <div className="app">
      <img src={logo} alt="logo" className="logo" />
      <Title text="Hello, Webpack!!!!!" />
      <Button type="primary">GOT IT!!!</Button>
      <Title text={`计时器：${value}`} />
    </div>
  );
};

export default Home;
