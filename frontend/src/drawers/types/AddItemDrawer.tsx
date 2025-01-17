import { ActionSymbol } from '@common/Actions';
import IndentedText from '@common/IndentedText';
import RichText from '@common/RichText';
import TraitsDisplay from '@common/TraitsDisplay';
import { TEXT_INDENT_AMOUNT } from '@constants/data';
import { fetchContentAll, fetchContentById } from '@content/content-store';
import {
  Title,
  Text,
  Image,
  Loader,
  Group,
  Divider,
  Stack,
  Box,
  Flex,
  Button,
  TextInput,
  ActionIcon,
  HoverCard,
  rem,
  Pagination,
  Center,
  ScrollArea,
} from '@mantine/core';
import { IconAdjustments, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { AbilityBlock, Item, Trait } from '@typing/content';
import { Operation } from '@typing/operations';
import { useEffect, useRef, useState } from 'react';
import * as JsSearch from 'js-search';
import { ItemSelectionOption } from '@common/select/SelectContent';
import { drawerState } from '@atoms/navAtoms';
import { useRecoilState } from 'recoil';

export function AddItemDrawerTitle(props: { data: {} }) {
  return (
    <>
      <Group justify='space-between' wrap='nowrap'>
        <Group wrap='nowrap' gap={10}>
          <Box>
            <Title order={3}>Add Item</Title>
          </Box>
          <Box></Box>
        </Group>
      </Group>
    </>
  );
}

export function AddItemDrawerContent(props: {
  data: { onClick: (item: Item, type: 'GIVE' | 'BUY' | 'FORMULA') => void };
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const NUM_PER_PAGE = 20;
  const [activePage, setPage] = useState(1);

  const { data: rawItems, isFetching } = useQuery({
    queryKey: [`find-items`],
    queryFn: async () => {
      return (await fetchContentAll<Item>('item')).sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  // Filter options based on search query
  const search = useRef(new JsSearch.Search('id'));
  useEffect(() => {
    if (!rawItems) return;
    search.current.addIndex('name');
    search.current.addIndex('group');
    search.current.addDocuments(rawItems);
  }, [rawItems]);

  const items = searchQuery.trim()
    ? (search.current.search(searchQuery.trim()) as Item[])
    : rawItems ?? [];

  useEffect(() => {
    setPage(1);
    scrollToTop();
  }, [rawItems]);

  const viewport = useRef<HTMLDivElement>(null);
  const scrollToTop = () => viewport.current?.scrollTo({ top: 0 });

  return (
    <Stack gap={5} justify='space-between' style={{ overflow: 'hidden' }}>
      <Stack gap={5}>
        <Group gap={10}>
          <TextInput
            style={{ flex: 1 }}
            leftSection={<IconSearch size='0.9rem' />}
            placeholder={`Search all items`}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <HoverCard shadow='md' position='top' openDelay={250} zIndex={10000} withinPortal>
            <HoverCard.Target>
              <ActionIcon
                variant='subtle'
                radius='xl'
                size='lg'
                color='gray.6'
                aria-label='Advanced Search'
                onClick={() => {
                  console.log('Advanced Search');
                }}
                style={{
                  pointerEvents: 'auto',
                }}
              >
                <IconAdjustments style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown px={10} py={5}>
              <Text size='sm'>Advanced Search</Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      </Stack>
      <ScrollArea
        viewportRef={viewport}
        h={'calc(100vh - 160px)'}
        style={{ position: 'relative' }}
        pr={5}
        scrollbars='y'
      >
        {isFetching ? (
          <Loader
            type='bars'
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : (
          <ItemsList
            options={items.slice((activePage - 1) * NUM_PER_PAGE, activePage * NUM_PER_PAGE)}
            onClick={props.data.onClick}
          />
        )}
      </ScrollArea>
      <Center>
        {items && (
          <Pagination
            size='sm'
            total={Math.ceil(items.length / NUM_PER_PAGE)}
            value={activePage}
            onChange={(value) => {
              setPage(value);
              scrollToTop();
            }}
          />
        )}
      </Center>
    </Stack>
  );
}

function ItemsList(props: {
  options: Item[];
  onClick: (item: Item, type: 'GIVE' | 'BUY' | 'FORMULA') => void;
}) {
  const [_drawer, openDrawer] = useRecoilState(drawerState);

  return (
    <Stack gap={0}>
      {props.options.map((item, index) => (
        <ItemSelectionOption
          key={index}
          item={item}
          onClick={(item) => {
            openDrawer({
              type: 'item',
              data: { id: item.id },
              extra: { addToHistory: true },
            });
          }}
          includeAdd
          onAdd={props.onClick}
        />
      ))}
    </Stack>
  );
}
