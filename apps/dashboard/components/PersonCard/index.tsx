import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RichTextEditor from '../RichTextEditor';
import { Descendant } from 'slate';
import { ButtonLink } from '..';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 0',
  },
  avatar: {
    width: '80px',
    height: '80px',
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
}));

type PersonCardType = {
  personId?: string;
  bio: {
    name: string;
    linkedin: string;
    pic: string;
    joinDate: string;
  };
  notes: Descendant[];
};

export default function PersonCard({
  personId,
  bio: { name, linkedin, pic, joinDate },
  notes,
}: PersonCardType) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            alt={`picture of ${name}`}
            src={pic}
            className={classes.avatar}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon color={'primary'} />
          </IconButton>
        }
        title={
          <ButtonLink href={`/team/${personId}`} style={{ padding: '0' }}>
            <Typography variant={'h6'}>{name}</Typography>
          </ButtonLink>
        }
        subheader={
          <>
            <Typography
              variant={'body2'}
              paragraph
            >{`Joined: ${joinDate}`}</Typography>
            <Typography variant={'h6'}>{`Software Developer`}</Typography>
          </>
        }
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon color={'secondary'} />
        </IconButton>
        <IconButton aria-label="linkedin" href={linkedin}>
          <ShareIcon color={'primary'} />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          color={'primary'}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <RichTextEditor content={notes} readOnly />
        </CardContent>
      </Collapse>
    </Card>
  );
}
