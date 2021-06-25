import * as React from 'react';
import { useFormik } from 'formik';
import {
  Button,
  TextField,
  NativeSelect,
  InputLabel,
  FormControl,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import useSWR from 'swr';
import { templatesType, questionsType } from '@types';
import { useRouter } from 'next/router';
import UsePostData from '../../../../utils/UsePostData';

const useStyles = makeStyles(() => ({
  formElement: {
    display: 'block',
    margin: '40px 0',
  },
  submitBtn: {
    margin: '80px 0',
  },
}));

type formType = {
  title: string;
  date: string;
  template: string;
};

type formErrorsType = {
  title?: string;
  date?: string;
  template?: string;
};

const NewMeeting = () => {
  const router = useRouter();
  const {
    query: { id: personId },
  } = router;

  const [currentTemplate, setCurrentTemplate] = React.useState(null);
  const classes = useStyles();
  const { data }: { data?: templatesType } = useSWR(
    'http://localhost:3333/api/templates'
  );
  const { data: listOfQuestions }: { data?: questionsType } = useSWR([
    currentTemplate
      ? `http://localhost:3333/api/questions/${currentTemplate}`
      : null,
    1,
  ]);

  const { data: response, isInProgress, error, API } = UsePostData();

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      template: '',
    },
    validate: (values: formType) => {
      const errors: formErrorsType = {};
      const { title, date, template } = values;

      if (!title) {
        errors.title = 'Title is required!';
      }
      if (!date) {
        errors.date = 'Date is required!';
      }
      if (!template) {
        errors.template = 'You need to choose a template';
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log('send to ', personId);
      console.log(values);

      API.POST({
        url: `http://localhost:3333/api/people/${personId}/meetings`,
        content: values,
      });
    },
  });

  React.useEffect(() => {
    if (response && response.status === 200) {
      router.push(`/team/${personId}`);
    }
  }, [router, response, personId]);

  return (
    <>
      <TextField
        error={!!formik.errors.title}
        helperText={formik.errors.title}
        id={formik.errors.title ? 'error-meeting-title' : 'Meeting Title'}
        label={'Meeting Title'}
        name={'title'}
        onChange={formik.handleChange}
        className={classes.formElement}
      />
      <TextField
        error={!!formik.errors.date}
        id={formik.errors.date ? 'error-datetime-local' : 'datetime-local'}
        label="Date and Time"
        type="datetime-local"
        name={'date'}
        onChange={formik.handleChange}
        className={classes.formElement}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControl className={classes.formElement}>
        <InputLabel htmlFor="age-native-simple">Meeting Template</InputLabel>
        <NativeSelect
          value={formik.values.template}
          inputProps={{
            name: 'template',
            id: 'template',
          }}
          onChange={(newValue) => {
            setCurrentTemplate(newValue.target.value);
            formik.handleChange(newValue);
          }}
        >
          <option aria-label="None" value="" />
          {data &&
            Object.entries(data).map(([id, { title, frequency: { text } }]) => (
              <option value={id} key={id}>
                {title} - suggested frequency: {text}
              </option>
            ))}
        </NativeSelect>
        {listOfQuestions ? (
          <ul>
            {Object.values(listOfQuestions).map((q) => (
              <li key={q.id}>{q.text}</li>
            ))}
          </ul>
        ) : (
          <p>Select a template to see the list of questions</p>
        )}
      </FormControl>
      <Button
        disabled={!formik.isValid}
        variant="contained"
        color="primary"
        onClick={() => formik.handleSubmit()}
        className={clsx(classes.formElement, classes.submitBtn)}
      >
        Submit
      </Button>
      {response && <p>Meeting added with success!!</p>}
      {/* {response && router.replace('/')} */}
    </>
  );
};

export default NewMeeting;
