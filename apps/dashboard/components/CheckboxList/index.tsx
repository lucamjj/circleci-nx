import React from 'react';
import { questionsType } from '@types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

type stateType = {
  id: string;
  text: string;
  checked: boolean;
};

type questionsStateType = {
  [id: string]: stateType;
};

const computeInitialState = (
  list: questionsType[]
): questionsStateType[] | Record<never, never> =>
  Object.values(list).reduce((prev, elem) => {
    return {
      ...prev,
      [`${elem.id}`]: {
        id: elem.id,
        text: elem.text,
        checked: true,
      },
    };
  }, {});

const CheckboxList = ({ list }: { list: questionsType[] }) => {
  const [state, setState] = React.useState<
    questionsStateType[] | Record<never, never>
  >(computeInitialState(list));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {
      ...state,
      [event.target.name]: {
        ...state[event.target.name],
        checked: event.target.checked,
      },
    };

    setState(newState);
  };

  return (
    <FormGroup>
      {Object.values(state).map((currQuestion) => {
        const { id, text, checked } = (currQuestion as unknown) as stateType;
        return (
          <FormControlLabel
            key={id}
            control={
              <Checkbox checked={checked} onChange={handleChange} name={id} />
            }
            label={text}
          />
        );
      })}
    </FormGroup>
  );
};

export default CheckboxList;
