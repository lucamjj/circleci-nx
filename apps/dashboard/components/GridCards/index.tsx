import React from 'react';
import Grid, { GridSize } from '@material-ui/core/Grid';

const getCards = (cardComponent, data, cols, updateListOfMeetings) => {
  const rowsNumber = data.length / cols;

  const newArray = [...data];

  const Card = cardComponent;

  return Array.from({ length: Math.ceil(rowsNumber) }).map(() => (
    <Grid
      container
      item
      xs={12}
      spacing={6}
      key={Math.random() + newArray.length}
    >
      {newArray.splice(0, cols).map((props, index) => (
        <Grid item xs={12} sm={(12 / cols) as GridSize} key={index}>
          <Card {...props} updateListOfMeetings={updateListOfMeetings} />
        </Grid>
      ))}
    </Grid>
  ));
};

const GridCards = ({
  cardComponent,
  data,
  cols,
  updateListOfMeetings,
}: {
  cardComponent: React.FC;
  data: unknown;
  cols: GridSize;
  updateListOfMeetings?: (newList: []) => void;
}) => {
  return (
    <Grid container spacing={1}>
      {getCards(cardComponent, data, cols, updateListOfMeetings)}
    </Grid>
  );
};

export default GridCards;
