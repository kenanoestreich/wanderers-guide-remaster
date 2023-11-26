import { Box, Divider, Text, useMantineTheme } from '@mantine/core';

export default function ResultWrapper(props: { label: string; disabled?: boolean; children: React.ReactNode }) {
  const theme = useMantineTheme();

  if(props.disabled) return (<>{props.children}</>);

  return (
    <>
      <Box
        px='xs'
        pt='sm'
        pb='xs'
        style={{
          border: '1px solid ' + theme.colors.dark[3],
          borderRadius: theme.radius.md,
          position: 'relative',
        }}
      >
        <Text
          fz='xs'
          px={5}
          style={{
            position: 'absolute',
            top: -11,
            backgroundColor: theme.colors.dark[6],
          }}
        >
          {props.label}
        </Text>
        {props.children}
      </Box>
    </>
  );
}
