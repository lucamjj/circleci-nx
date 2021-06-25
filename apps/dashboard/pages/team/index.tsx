import React from 'react';
import useSWR from 'swr';
import GridCards from '../../components/GridCards';
import PersonCard from '../../components/PersonCard';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const Team = () => {
  const classes = useStyles();
  const { data, error } = useSWR('http://localhost:3333/api/people');

  if (error) return <div>failed to load people</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className={classes.root}>
      <GridCards cardComponent={PersonCard as React.FC} data={data} cols={2} />
    </div>
  );
};
export default Team;
