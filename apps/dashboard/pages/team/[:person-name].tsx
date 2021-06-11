import React from 'react';
import useSWR from 'swr';
import MeetingCard from '../../components/MeetingCard';
import { withRouter } from 'next/router';
import GridCards from '../../components/GridCards';

const PersonPage = withRouter(({ router }) => {
  const personId = router.query.id;

  const { data, error } = useSWR(
    `http://localhost:3333/api/people/${personId}`
  );
  if (error) return <div>failed to load person</div>;
  if (!data) return <div>loading person info...</div>;

  const { meetings } = data;
  const meetingsData = Object.entries(meetings).reduce(
    (prev, [meetingId, meetingInfo]) => {
      return [
        ...prev,
        {
          personId,
          meetingId,
          meetingInfo,
        },
      ];
    },
    []
  );

  return <GridCards cardComponent={MeetingCard} data={meetingsData} />;
});

export default PersonPage;
