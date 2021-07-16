import * as React from 'react';
import { useFormik } from 'formik';
import {
  TextField,
  NativeSelect,
  InputLabel,
  FormControl,
  makeStyles,
} from '@material-ui/core';
import useSWR from 'swr';
import { templatesType, questionInfoType } from '@types';
import { useRouter } from 'next/router';
import { UsePostData } from '@hooks';
import TransferList from '../../../../components/TransferList';
import Stepper from '../../../../components/Stepper';
import { questionsFromTemplate } from '@utils';
import AddNewComponent from '../../../../components/AddNewQuestion';

const useStyles = makeStyles((theme) => ({
  formElement: {
    display: 'block',
    margin: '40px 0',
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

const steps = {
  '0': {
    shortDescription: 'Title',
    longDescription: 'Can you think of a meeting title?',
  },
  '1': {
    shortDescription: 'Date',
    longDescription: 'When is the meeting going to happen?',
  },
  '2': {
    shortDescription: 'Template',
    longDescription: 'Choose a template and questions',
  },
};

const Step = ({
  isValid,
  children,
}: {
  isValid?: boolean;
  children: JSX.Element;
}) => {
  return children;
};

const NewMeeting = () => {
  const router = useRouter();
  const {
    query: { id: personId },
  } = router;

  const [chosenQuestions, setChosenQuestions] = React.useState([]);

  const [currentTemplate, setCurrentTemplate] = React.useState('0');
  const classes = useStyles();
  const { data }: { data?: templatesType } = useSWR(
    'http://localhost:3333/api/templates'
  );

  const { data: listOfQuestions }: { data?: questionInfoType[] } = useSWR(
    `http://localhost:3333/api/questions`
  );

  const { data: response, API } = UsePostData();

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
      console.log({ ...values, questions: chosenQuestions });

      API.POST({
        url: `http://localhost:3333/api/people/${personId}/meetings`,
        content: { ...values, questions: chosenQuestions },
      });
    },
  });

  const handleOnReset = () => {
    formik.setValues({
      title: '',
      date: '',
      template: '',
    });
    formik.setTouched({});
  };

  const handleOnFinish = () => {
    formik.handleSubmit();
  };

  React.useEffect(() => {
    if (response && response.status === 200) {
      router.push(`/team/${personId}`);
    }
  }, [router, response, personId]);

  const getQuestions: questionInfoType[] = React.useMemo(() => {
    if (listOfQuestions && currentTemplate) {
      return questionsFromTemplate(
        Object.values(listOfQuestions),
        currentTemplate
      );
    }
  }, [listOfQuestions, currentTemplate]);

  React.useEffect(() => {
    setChosenQuestions(getQuestions);
  }, [getQuestions]);

  return (
    <>
      <Stepper
        stepsContentDescription={steps}
        handleOnReset={handleOnReset}
        handleOnFinish={handleOnFinish}
      >
        <Step
          isValid={formik.touched.title === true && formik.errors.title !== ''}
        >
          <TextField
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.errors.title}
            id={formik.errors.title ? 'error-meeting-title' : 'Meeting Title'}
            label={'Meeting Title'}
            value={formik.values.title}
            name={'title'}
            onChange={(value) => {
              formik.setTouched({ ...formik.touched, title: true });
              formik.handleChange(value);
            }}
            className={classes.formElement}
          />
        </Step>
        <Step
          isValid={formik.touched.date === true && formik.errors.date !== ''}
        >
          <TextField
            error={formik.touched.date && !!formik.errors.date}
            id={formik.errors.date ? 'error-datetime-local' : 'datetime-local'}
            label="Date and Time"
            value={formik.values.date}
            type="datetime-local"
            name={'date'}
            onChange={(value) => {
              formik.setTouched({ ...formik.touched, date: true });
              formik.handleChange(value);
            }}
            className={classes.formElement}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Step>
        <Step
          isValid={formik.touched.date === true && formik.errors.date !== ''}
        >
          <FormControl className={classes.formElement}>
            <InputLabel htmlFor="age-native-simple">
              Meeting Template
            </InputLabel>
            <NativeSelect
              value={formik.values.template}
              inputProps={{
                name: 'template',
                id: 'template',
              }}
              onChange={(newValue) => {
                setCurrentTemplate(newValue.target.value);
                formik.setTouched({ ...formik.touched, template: true });
                formik.handleChange(newValue);
              }}
            >
              <option aria-label="Free style" value={'0'}>
                Free style
              </option>
              {data &&
                Object.entries(data).map(
                  ([
                    id,
                    {
                      title,
                      frequency: { text },
                    },
                  ]) => (
                    <option
                      aria-label={`template ${title}`}
                      value={id}
                      key={id}
                    >
                      {title} - suggested frequency: {text}
                    </option>
                  )
                )}
            </NativeSelect>
            <div
              style={{
                margin: '20px 0',
              }}
            >
              <AddNewComponent />
            </div>
            {listOfQuestions ? (
              <TransferList
                leftList={listOfQuestions}
                rightList={currentTemplate !== '0' ? chosenQuestions : []}
                cb={(list) => {
                  setChosenQuestions(list);
                }}
              />
            ) : (
              'Fetching questions'
            )}
          </FormControl>
        </Step>
      </Stepper>
      {response && <p>Meeting added with success!!</p>}
    </>
  );
};

export default NewMeeting;
