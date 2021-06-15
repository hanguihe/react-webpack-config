import { FC } from 'react';

interface TextProps {
  text: string;
}

const Text: FC<TextProps> = ({ text }) => {
  return <h3>{text}</h3>;
};

export default Text;
