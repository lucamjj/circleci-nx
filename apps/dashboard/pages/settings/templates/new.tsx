import * as React from 'react';
import { useFormik } from 'formik';
import { TextField, FormControl, makeStyles } from '@material-ui/core';
import useSWR from 'swr';
import { questionInfoType } from '@types';
import { useRouter } from 'next/router';
import { UsePostData } from '@hooks';
import TransferList from '../../../components/TransferList';
import Stepper from '../../../components/Stepper';
import AddNewComponent from '../../../components/AddNewQuestion';

const useStyles = makeStyles((theme) => ({
  formElement: {
    display: 'block',
    margin: '40px 0',
  },
}));

type formType = {
  title: string;
  questions: questionInfoType[];
};

type formErrorsType = {
  title?: string;
  questions?: questionInfoType[];
};

const steps = {
  '0': {
    shortDescription: 'Title',
    longDescription: 'Can you think of a meeting title?',
  },
  '1': {
    shortDescription: 'Questions',
    longDescription: 'Choose some questions to add to the template',
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

const NewTemplate = () => {
  const router = useRouter();
  const {
    query: { id: personId },
  } = router;

  const [chosenQuestions, setChosenQuestions] = React.useState([]);

  const classes = useStyles();

  const { data: listOfQuestions }: { data?: questionInfoType[] } = useSWR(
    `http://localhost:3333/api/questions`
  );

  const { data: response, API } = UsePostData();

  const formik = useFormik({
    initialValues: {
      title: '',
      questions: [],
    },
    validate: (values: formType) => {
      const errors: formErrorsType = {};
      const { title } = values;

      if (!title) {
        errors.title = 'Title is required!';
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
      questions: [],
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

  // React.useEffect(() => {
  //   setChosenQuestions(getQuestions);
  // }, [getQuestions]);

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
            id={formik.errors.title ? 'error-template-title' : 'Template Title'}
            label={'Template Title'}
            value={formik.values.title}
            name={'title'}
            onChange={(value) => {
              formik.setTouched({ ...formik.touched, title: true });
              formik.handleChange(value);
            }}
            className={classes.formElement}
          />
        </Step>
        <Step isValid={true}>
          <>
            <div
              style={{
                margin: '20px 0',
              }}
            >
              <AddNewComponent />
            </div>
            <FormControl className={classes.formElement}>
              {listOfQuestions ? (
                <TransferList
                  leftList={listOfQuestions}
                  rightList={chosenQuestions}
                  cb={(list) => {
                    setChosenQuestions(list);
                  }}
                />
              ) : (
                'Fetching questions'
              )}
            </FormControl>
          </>
        </Step>
      </Stepper>
      {response && <p>Meeting added with success!!</p>}
    </>
  );
};

export default NewTemplate;
