export function getBabelConfig(isDevelopment: boolean) {
  return {
    babelrc: false,
    configFile: false,
    sourceType: 'unambiguous',
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false,
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      isDevelopment && require.resolve('react-refresh/babel'),
      require.resolve('@babel/plugin-transform-runtime'),
    ].filter(Boolean),
  };
}
