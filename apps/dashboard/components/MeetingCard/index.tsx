import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RichTextEditor from '../RichTextEditor';
import formatZuluTime from '../../utils/formatZuluDate';
import { ButtonLink } from '..';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 0',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: theme.palette.warning.main,
  },
}));

export default function MeetingCard({
  personId,
  meetingId,
  meetingInfo: { title, date, questions, notes },
}) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>1:1</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <ButtonLink
            href={`${personId}/meetings/${meetingId}`}
            style={{ padding: '0' }}
          >
            <Typography variant={'body1'}>
              {title || 'Ops, no title here!'}
            </Typography>
          </ButtonLink>
        }
        subheader={`${formatZuluTime(date)}`}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="delete meeting">
          <Delete color={'primary'} />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <RichTextEditor
          origin={`http://localhost:3333/api/people/${personId}/meetings/${meetingId}`}
          content={notes}
        />
      </Collapse>
    </Card>
  );
}
