import React from 'react';
import Grid from '@material-ui/core/Grid';

const getCards = (cardComponent, data) => {
  const rowsNumber = data.length / 3;

  const newArray = [...data];

  const Card = cardComponent;

  return Array.from({ length: Math.ceil(rowsNumber) }).map(() => (
    <Grid
      container
      item
      xs={12}
      spacing={3}
      key={Math.random() + newArray.length}
    >
      {newArray.splice(0, 3).map((props, index) => (
        <Grid item xs={4} key={index}>
          <Card {...props} />
        </Grid>
      ))}
    </Grid>
  ));
};

const GridCards = ({ cardComponent, data }) => {
  return (
    <Grid container spacing={1}>
      {getCards(cardComponent, data)}
    </Grid>
  );
};

export default GridCards;
