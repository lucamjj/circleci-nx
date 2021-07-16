import React from 'react';
import Button from '../Button';
import Add from '@material-ui/icons/Add';
import Storage from '@material-ui/icons/Storage';
import Delete from '@material-ui/icons/Delete';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { UsePostData } from '@hooks';
import { TransferList } from '../TransferList';
import { templatesType } from '@types';
import useSWR from 'swr';
import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '20px 0 20px 10px',
    },
    '& > :first-child': {
      marginLeft: '0px',
    },
  },
}));

type formType = {
  title: string;
  templatesIds: number[];
};

type formErrorsType = {
  title?: string;
};

const AddNewQuestion = () => {
  const classes = useStyles();
  const [showNewQuestion, setShowNewQuestion] = React.useState(false);
  const [chosenTemplatesIds, setChosenTemplatesIds] = React.useState([]);

  const { API } = UsePostData();

  const { data: listOfTemplates }: { data?: templatesType } = useSWR(
    'http://localhost:3333/api/templates'
  );

  // console.log(listOfTemplates);

  const formik = useFormik({
    initialValues: {
      title: '',
      templatesIds: [],
    },
    validate: (values: formType) => {
      console.log('Validate', values);

      const errors: formErrorsType = {};
      const { title } = values;

      console.log(title);

      if (!title) {
        errors.title = 'Title is required!';
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log('POST', {
        text: values.title,
        templatesIds: chosenTemplatesIds.map(({ id }) => id),
      });

      API.POST({
        url: `http://localhost:3333/api/questions`,
        content: {
          text: values.title,
          templatesIds: chosenTemplatesIds.map(({ id }) => id),
        },
      });
    },
  });

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setShowNewQuestion(true);
        }}
        disabled={showNewQuestion}
      >
        Add new question
      </Button>
      {showNewQuestion && (
        <div style={{ margin: '20px 0' }}>
          <TextField
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.errors.title}
            id={
              formik.errors.title ? 'error-new-question-id' : 'new-question-id'
            }
            label={'What would you like to ask?'}
            name={'title'}
            value={formik.values.title}
            onChange={(value) => {
              console.log('OnChange:', value);

              console.log(value.target.value);

              formik.setTouched({ ...formik.touched, title: true });
              formik.handleChange(value);
            }}
            fullWidth
          />
          <p>Add question to 1 or more templates:</p>
          {listOfTemplates && (
            <TransferList
              leftList={Object.values(listOfTemplates)}
              rightList={chosenTemplatesIds || []}
              cb={(list) => {
                console.log(list);
                setChosenTemplatesIds(list);
              }}
            />
          )}
          <div className={classes.root}>
            <Button
              variant="contained"
              startIcon={<Storage />}
              disabled={!formik.values.title}
              onClick={() => formik.handleSubmit()}
            >
              Save question
            </Button>
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={() => {
                setShowNewQuestion(false);
                // setQuestion(null);
              }}
            >
              Delete question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewQuestion;
