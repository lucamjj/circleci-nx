import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Transforms, createEditor, Descendant } from 'slate';
import { Slate, Editable, useSlateStatic, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { makeStyles } from '@material-ui/core';
import RichTextEditor from '../../../../../components/RichTextEditor';
import { Button } from '../../../../../components';
import Add from '@material-ui/icons/Add';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

type OrNull<T> = T | null;

const useStyles = makeStyles((theme) => ({
  unsetWidthStyle: {
    width: 'unset',
  },
  menu: {
    '& > *': {
      display: 'inline-block',
    },
    '& > * + * ': {
      'margin-left': '15px',
    },
  },
  toolbar: {
    position: 'relative',
    padding: '1px 18px 17px',
    margin: '0 -20px',
    'border-bottom': '2px solid #eee',
    'margin-bottom': '20px',
  },
}));

export const Menu = React.forwardRef(
  (
    { className, ...props }: React.PropsWithChildren<BaseProps>,
    ref: React.Ref<OrNull<HTMLDivElement>>
  ) => {
    const classes = useStyles();
    return <div {...props} ref={ref} className={classes.menu} />;
  }
);
export const Toolbar = React.forwardRef(
  (
    { ...props }: React.PropsWithChildren<BaseProps>,
    ref: React.Ref<OrNull<HTMLDivElement>>
  ) => {
    const classes = useStyles();
    return <Menu {...props} ref={ref} className={classes.toolbar} />;
  }
);

export type EmptyText = {
  text: string;
};

export type EditableVoidElement = {
  type: 'editable-void';
  children: EmptyText[];
};

const EditableVoidsExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const editor = useMemo(
    () => withEditableVoids(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Toolbar>
        <InsertEditableVoidButton />
      </Toolbar>

      <Editable
        renderElement={(props) => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  );
};

const withEditableVoids = (editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'editable-void' ? true : isVoid(element);
  };

  return editor;
};

const insertEditableVoid = (editor) => {
  const text = { text: '' };
  const voidNode: EditableVoidElement = {
    type: 'editable-void',
    children: [text],
  };
  Transforms.insertNodes(editor, voidNode);
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'editable-void':
      return <EditableVoid {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const EditableVoid = ({ attributes, children, element }) => {
  const classes = useStyles();
  const { query } = useRouter();
  const [inputValue, setInputValue] = useState('');

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div style={{ boxShadow: '0 0 0 3px #ddd', padding: '8px' }}>
        <h4>Name:</h4>
        <input
          style={{ margin: '8px 0' }}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <h4>Left or right handed:</h4>
        <input
          className={classes.unsetWidthStyle}
          type="radio"
          name="handedness"
          value="left"
        />{' '}
        Left
        <br />
        <input
          className={classes.unsetWidthStyle}
          type="radio"
          name="handedness"
          value="right"
        />{' '}
        Right
        <h4>Tell us about yourself:</h4>
        <div style={{ padding: '20px', border: '2px solid #ddd' }}>
          <RichTextEditor
            origin={`http://localhost:3333/api/people/${query[':person-id']}/meetings/${query[':meeting-id']}`}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

const InsertEditableVoidButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={(event) => {
        event.preventDefault();
        insertEditableVoid(editor);
      }}
    >
      <Add />
    </Button>
  );
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.',
      },
    ],
  },
  {
    type: 'editable-void',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

export default EditableVoidsExample;
