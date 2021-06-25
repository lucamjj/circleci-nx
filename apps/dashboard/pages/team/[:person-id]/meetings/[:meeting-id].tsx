import { useRouter } from 'next/router';
import RichTextEditor from '../../../../components/RichTextEditor';
import React from 'react';

const MeetingPage = () => {
  const { query } = useRouter();

  return (
    <RichTextEditor
      origin={`http://localhost:3333/api/people/${query[':person-id']}/meetings/${query[':meeting-id']}`}
    />
  );
};

export default MeetingPage;
