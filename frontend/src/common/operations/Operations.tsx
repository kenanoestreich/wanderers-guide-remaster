import {
  Badge,
  Text,
  Box,
  CloseButton,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  useMantineTheme,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { createDefaultOperation } from '@operations/operation-utils';
import { AbilityBlockType, Spell } from '@typing/content';
import {
  Operation,
  OperationAddBonusToValue,
  OperationAdjValue,
  OperationConditional,
  OperationCreateValue,
  OperationDefineCastingSource,
  OperationGiveAbilityBlock,
  OperationGiveLanguage,
  OperationGiveSpell,
  OperationGiveSpellSlot,
  OperationSelect,
  OperationSetValue,
  OperationType,
} from '@typing/operations';
import * as _ from 'lodash-es';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ConditionalOperation from './conditional/ConditionalOperation';
import { GiveActionOperation } from './ability_block/GiveActionOperation';
import { GiveClassFeatureOperation } from './ability_block/GiveClassFeatureOperation';
import { GiveFeatOperation } from './ability_block/GiveFeatOperation';
import { GiveSpellOperation } from './spell/GiveSpellOperation';
import { AdjValOperation } from './variables/AdjValOperation';
import { SetValOperation } from './variables/SetValOperation';
import { CreateValOperation } from './variables/CreateValOperation';
import { useDidUpdate } from '@mantine/hooks';
import { SelectionOperation } from './selection/SelectionOperation';
import { GiveLanguageOperation } from './language/GiveLanguageOperation';
import { GiveSenseOperation } from './ability_block/GiveSenseOperation';
import { GivePhysicalFeatureOperation } from './ability_block/GivePhysicalFeatureOperation';
import { addVariable, resetVariables } from '@variables/variable-manager';
import { GiveHeritageOperation } from './ability_block/GiveHeritageOperation';
import { AddBonusToValOperation } from './variables/AddBonusToValOperation';
import { GiveSpellSlotOperation } from './spell/GiveSpellSlotOperation';
import { DefineCastingSourceOperation } from './spell/DefineCastingSourceOperation';

export function OperationWrapper(props: {
  children: React.ReactNode;
  title: string;
  onRemove: () => void;
}) {
  const theme = useMantineTheme();

  const openConfirmModal = () =>
    modals.openConfirmModal({
      title: <Title order={4}>Remove Operation</Title>,
      children: <Text size='sm'>Are you sure you want to remove this operation?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => {},
      onConfirm: () => props.onRemove(),
    });

  return (
    <Container w={'min(700px, 100%)'}>
      <Paper
        py='xs'
        pl='xs'
        pr={40}
        radius='xl'
        style={{
          position: 'relative',
        }}
      >
        <Group wrap='nowrap' align='flex-start'>
          <Group align='flex-start'>
            <Badge
              variant='dot'
              size='lg'
              styles={{
                root: {
                  // @ts-ignore
                  '--badge-dot-size': 0,
                  textTransform: 'initial',
                },
              }}
              style={{
                borderRadius: 0,
                borderTopLeftRadius: theme.radius.xl,
                borderBottomLeftRadius: theme.radius.xl,
                borderTopRightRadius: 11,
                borderBottomRightRadius: 11,
              }}
            >
              {props.title}
            </Badge>
          </Group>

          {props.children}
        </Group>
        <Box
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 100,
          }}
        >
          <Tooltip label='Remove Operation' position='right' withArrow withinPortal>
            <CloseButton
              size='sm'
              radius='xl'
              onClick={() => {
                openConfirmModal();
              }}
            />
          </Tooltip>
        </Box>
      </Paper>
    </Container>
  );
}

export function OperationSection(props: {
  title: ReactNode;
  blacklist?: string[];
  value?: Operation[];
  onChange: (operations: Operation[]) => void;
}) {
  const [operations, setOperations] = useState<Operation[]>(props.value ?? []);
  const selectRef = useRef<HTMLInputElement>(null);

  useDidUpdate(() => {
    setOperations(props.value ?? []);

    // Reset variable store
    resetVariables();
    for (let op of props.value ?? []) {
      if (op.type === 'createValue') {
        addVariable('CHARACTER', op.data.type, op.data.variable, op.data.value);
      }
    }
  }, [props.value]);

  useDidUpdate(() => {
    props.onChange(operations);
  }, [operations]);

  return (
    <Stack gap={10}>
      <Group justify='space-between'>
        <Box>{props.title}</Box>
        <Select
          ref={selectRef}
          variant='filled'
          size='xs'
          placeholder='Add Operation'
          data={[
            { value: 'select', label: 'Selection' },
            { value: 'conditional', label: 'Conditional' },
            { value: 'giveAbilityBlock:::feat', label: 'Give Feat' },
            {
              value: 'giveAbilityBlock:::class-feature',
              label: 'Give Class Feature',
            },
            { value: 'giveAbilityBlock:::sense', label: 'Give Sense' },
            {
              value: 'giveAbilityBlock:::physical-feature',
              label: 'Give Physical Feature',
            },
            { value: 'giveAbilityBlock:::heritage', label: 'Give Heritage' },
            { value: 'giveSpell', label: 'Give Spell' },
            { value: 'giveSpellSlot', label: 'Give Spell Slots' },
            { value: 'defineCastingSource', label: 'Define Casting Source' },
            { value: 'giveLanguage', label: 'Give Language' },
            { value: 'giveSelectOption', label: 'Give Select Option' }, // TODO
            { value: 'adjValue', label: 'Adjust Value' },
            { value: 'addBonusToValue', label: 'Add Bonus to Value' },
            { value: 'createValue', label: 'Create Value' },
            { value: 'setValue', label: 'Override Value' },
            { value: 'RESO', label: 'RESO' }, // TODO
          ].filter((option) => !(props.blacklist ?? []).includes(option.value))}
          searchValue={''}
          value={null}
          onChange={(value) => {
            if (value) {
              let abilBlockType = null;
              if (value.includes('giveAbilityBlock:::')) {
                abilBlockType = value.split(':::')[1];
                value = 'giveAbilityBlock';
              }

              const newOp = createDefaultOperation(value as OperationType);

              if (newOp) {
                if (abilBlockType) {
                  (newOp as OperationGiveAbilityBlock).data.type =
                    abilBlockType as AbilityBlockType;
                }

                setOperations((prev) => {
                  return [...prev, newOp];
                });
                selectRef.current?.blur();
              }
            }
          }}
        />
      </Group>

      <Stack gap={10}>
        {operations.map((op, index) => (
          <OperationDisplay
            key={index}
            operation={op}
            onChange={(option) => {
              const newOp = _.cloneDeep(op);
              newOp.data = option.data;
              setOperations((prev) => {
                return prev.map((p_op) => {
                  if (p_op.id === op.id) {
                    return newOp;
                  } else {
                    return p_op;
                  }
                });
              });
            }}
            onRemove={(id) => {
              setOperations((prev) => {
                return prev.filter((p_op) => p_op.id !== id);
              });
            }}
          />
        ))}
        {operations.length === 0 && (
          <Text size='sm' c='gray.7' ta='center' fs='italic'>
            No operations
          </Text>
        )}
      </Stack>
    </Stack>
  );
}

export function OperationDisplay(props: {
  operation: Operation;
  onChange: (op: Operation) => void;
  onRemove: (id: string) => void;
}) {
  switch (props.operation.type) {
    case 'giveAbilityBlock':
      let opGiveAbilBlock = props.operation as OperationGiveAbilityBlock;
      switch (opGiveAbilBlock.data.type) {
        case 'feat':
          return (
            <GiveFeatOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        case 'action':
          return (
            <GiveActionOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        case 'class-feature':
          return (
            <GiveClassFeatureOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        case 'sense':
          return (
            <GiveSenseOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        case 'physical-feature':
          return (
            <GivePhysicalFeatureOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        case 'heritage':
          return (
            <GiveHeritageOperation
              selectedId={opGiveAbilBlock.data.abilityBlockId}
              onSelect={(option) => {
                opGiveAbilBlock.data.abilityBlockId = option.id;
                props.onChange(_.cloneDeep(opGiveAbilBlock));
              }}
              onRemove={() => props.onRemove(props.operation.id)}
            />
          );
        default:
          return null;
      }
    case 'giveSpell':
      let opGiveSpell = props.operation as OperationGiveSpell;
      return (
        <GiveSpellOperation
          data={opGiveSpell.data}
          onSelect={(data) => {
            opGiveSpell.data = _.cloneDeep(data);
            props.onChange(_.cloneDeep(opGiveSpell));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'giveSpellSlot':
      let opGiveSpellSlot = props.operation as OperationGiveSpellSlot;
      return (
        <GiveSpellSlotOperation
          castingSource={opGiveSpellSlot.data.castingSource}
          slots={opGiveSpellSlot.data.slots}
          onSelect={(source, slots) => {
            opGiveSpellSlot.data.castingSource = source;
            opGiveSpellSlot.data.slots = slots;
            props.onChange(_.cloneDeep(opGiveSpellSlot));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'defineCastingSource':
      let opDefineCastingSource = props.operation as OperationDefineCastingSource;
      return (
        <DefineCastingSourceOperation
          value={opDefineCastingSource.data.value as string}
          onSelect={(value) => {
            opDefineCastingSource.data.value = value;
            console.log('opDefineCastingSource', opDefineCastingSource);
            props.onChange(_.cloneDeep(opDefineCastingSource));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'giveLanguage':
      let opGiveLanguage = props.operation as OperationGiveLanguage;
      return (
        <GiveLanguageOperation
          selectedId={opGiveLanguage.data.languageId}
          onSelect={(option) => {
            opGiveLanguage.data.languageId = option.id;
            props.onChange(_.cloneDeep(opGiveLanguage));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'conditional':
      let opConditional = props.operation as OperationConditional;
      return (
        <ConditionalOperation
          conditions={opConditional.data.conditions}
          trueOperations={opConditional.data.trueOperations}
          falseOperations={opConditional.data.falseOperations}
          onChange={(conditions, trueOperations, falseOperations) => {
            opConditional.data.conditions = conditions;
            opConditional.data.trueOperations = trueOperations;
            opConditional.data.falseOperations = falseOperations;
            props.onChange(_.cloneDeep(opConditional));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'select':
      let opSelection = props.operation as OperationSelect;
      return (
        <SelectionOperation
          data={opSelection.data}
          onChange={(data) => {
            opSelection.data = data;
            props.onChange(_.cloneDeep(opSelection));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'adjValue':
      let opAdjValue = props.operation as OperationAdjValue;
      return (
        <AdjValOperation
          variable={opAdjValue.data.variable}
          value={opAdjValue.data.value}
          onSelect={(variable) => {
            opAdjValue.data.variable = variable;
            props.onChange(_.cloneDeep(opAdjValue));
          }}
          onValueChange={(value) => {
            opAdjValue.data.value = value;
            props.onChange(_.cloneDeep(opAdjValue));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'setValue':
      let opSetValue = props.operation as OperationSetValue;
      return (
        // TODO: make it VariableValue
        <SetValOperation
          variable={opSetValue.data.variable}
          value={opSetValue.data.value}
          onSelect={(variable) => {
            opSetValue.data.variable = variable;
            props.onChange(_.cloneDeep(opSetValue));
          }}
          onValueChange={(value) => {
            opSetValue.data.value = value;
            props.onChange(_.cloneDeep(opSetValue));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'createValue':
      let opCreateValue = props.operation as OperationCreateValue;
      return (
        <CreateValOperation
          variable={opCreateValue.data.variable}
          onNameChange={(variable) => {
            opCreateValue.data.variable = variable;
            props.onChange(_.cloneDeep(opCreateValue));
          }}
          variableType={opCreateValue.data.type}
          onTypeChange={(variableType) => {
            opCreateValue.data.type = variableType;
            props.onChange(_.cloneDeep(opCreateValue));
          }}
          value={opCreateValue.data.value}
          onValueChange={(value) => {
            opCreateValue.data.value = value;
            props.onChange(_.cloneDeep(opCreateValue));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    case 'addBonusToValue':
      let opAddBonusToValue = props.operation as OperationAddBonusToValue;
      return (
        <AddBonusToValOperation
          variable={opAddBonusToValue.data.variable}
          bonusValue={opAddBonusToValue.data.value}
          bonusType={opAddBonusToValue.data.type}
          text={opAddBonusToValue.data.text}
          onSelect={(variable) => {
            opAddBonusToValue.data.variable = variable;
            props.onChange(_.cloneDeep(opAddBonusToValue));
          }}
          onValueChange={(data) => {
            opAddBonusToValue.data.value = data.bonusValue;
            opAddBonusToValue.data.type = data.bonusType;
            opAddBonusToValue.data.text = data.text;
            props.onChange(_.cloneDeep(opAddBonusToValue));
          }}
          onRemove={() => props.onRemove(props.operation.id)}
        />
      );
    default:
      return null;
  }
}
