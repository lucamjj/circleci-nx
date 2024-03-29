import React, { useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import axios from 'axios';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate';
import { withHistory } from 'slate-history';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import useSWR from 'swr';

import { Icon, Toolbar, RichTextButton as Button } from './components';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';

export type CustomElement = {
  type: 'paragraph' | 'block-quote';
  children: CustomText[];
};

export type meetingNotesType = {
  notes: CustomElement[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const RichTextEditor = ({
  origin,
  content = null,
  readOnly = false,
}: {
  origin?: string;
  content?: null | Descendant[];
  readOnly?: boolean;
}) => {
  const [richText, setRichText] = useState<Descendant[]>(content);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const refFirstRender = React.useRef({ firstRender: true });
  const [addContentError, setAddContentError] = useState(null);
  const { data: notesToDisplay, error } = useSWR(content ? null : origin);

  React.useEffect(() => {
    let currentSource = null;
    const addNewContent = async () => {
      console.log('Write to JSON');
      console.log('RichText', richText);

      const cancelToken = axios.CancelToken;
      currentSource = cancelToken.source();
      await axios
        .put(
          origin,
          { content: richText },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            cancelToken: currentSource.token,
          }
        )
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            setAddContentError({
              error: 'It was not possible to save the content',
            });
          }
        });
    };

    richText && refFirstRender.current.firstRender === false && addNewContent();

    return () => {
      currentSource && currentSource.cancel('Axios: put request cancelled');
    };
  }, [richText, origin]);

  if (error) return <div>failed to load notes</div>;
  if (!content && !notesToDisplay) return <div>loading notes...</div>;

  return richText || notesToDisplay ? (
    <Slate
      editor={editor}
      value={
        richText ||
        notesToDisplay.notes || [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ]
      }
      onChange={(value) => {
        if (refFirstRender.current.firstRender === false) {
          setRichText(value);
        }
        refFirstRender.current.firstRender = false;
      }}
    >
      {!readOnly && (
        <Toolbar
          style={{
            backgroundColor: 'white',
          }}
        >
          <MarkButton format="bold" icon="formatBold" />
          <MarkButton format="italic" icon="formatItalic" />
          <MarkButton format="underline" icon="formatUnderlined" />
          <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looksOne" />
          <BlockButton format="heading-two" icon="looksTwo" />
          <BlockButton format="block-quote" icon="formatCode" />
          <BlockButton format="numbered-list" icon="formatListNumbered" />
          <BlockButton format="bulleted-list" icon="formatListBulleted" />
        </Toolbar>
      )}
      <Editable
        // style={{
        //   margin: '-16px -20px',
        // }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
        readOnly={readOnly}
      />
    </Slate>
  ) : (
    <p>No notes fetched</p>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case '-bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'bulleted-list':
      return <FormGroup {...attributes}>{children}</FormGroup>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case '-list-item':
      return <li {...attributes}>{children}</li>;
    case 'list-item':
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox color="primary" {...attributes} />
          <span>{children}</span>
        </div>
      );
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon iconName={icon} />
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon iconName={icon} />
    </Button>
  );
};

export default RichTextEditor;
